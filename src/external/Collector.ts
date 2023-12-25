/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig } from 'axios'
import { verbose } from '../api'
import { CONFIG } from '../config'
import { LogQueryRequest } from '../types'
import { BaseExternal, axiosWithRetry } from './BaseExternal'
import {
  TransactionFactory,
  FeeMarketEIP1559Transaction,
  AccessListEIP2930Transaction,
  AccessList,
} from '@ethereumjs/tx'
import { bufferToHex, toBuffer } from 'ethereumjs-util'

class Collector extends BaseExternal {
  
  constructor(baseURL: string) {
    super(baseURL, 3, {
      'Content-Type': 'application/json',
    })
  }

  async getLogsByFilter(request: LogQueryRequest): Promise<any[] | null> {
    if (!CONFIG.collectorSourcing.enabled) return null

    /* prettier-ignore */ console.log(`Collector: getLogsByFilter call for request: ${JSON.stringify(request)}`)
    try {
      const url = this.buildLogAPIUrl(request, this.baseUrl)
      /* prettier-ignore */ if (verbose) console.log(`Collector: getLogsByFilter built log API URL: ${url}`)

      const res = await axios.get(url)

      if (!res.data.success) return null

      const logs = res.data.logs.map((el: any) => el.log)
      return logs
    } catch (e) {
      console.error('An error occurred for Collector.getLogsByFilter:', e)
      return null
    }
  }

  async getTransactionByHash(txHash: string): Promise<readableTransaction | null> {
    if (!CONFIG.collectorSourcing.enabled) return null

    /* prettier-ignore */ console.log(`Collector: getTransactionByHash call for txHash: ${txHash}`)
    const requestConfig: AxiosRequestConfig = {
      method: 'get',
      url: `${this.baseUrl}/api/transaction?txHash=${txHash}`,
      headers: this.defaultHeaders,
    }

    try {
      /* prettier-ignore */ if (verbose) console.log(`Collector: getTransactionByHash requestConfig: ${JSON.stringify(requestConfig)}`)
      const res = await axiosWithRetry<{ success: boolean; transactions: any }>(requestConfig)
      /* prettier-ignore */ if (verbose) console.log(`Collector: getTransactionByHash res: ${JSON.stringify(res.data)}`)
      if (!res.data.success) return null

      const tx = res.data.transactions && res.data.transactions[0] ? res.data.transactions[0] : null

      const result = tx ? this.decodeTransaction(tx) : null

      /* prettier-ignore */ if (verbose) console.log(`Collector: getTransactionByHash result: ${JSON.stringify(result)}`)
      return result
    } catch (error) {
      console.error('Collector: Error getting transaction by hash', error)
      return null
    }
  }

  async getTransactionReceipt(txHash: string): Promise<any | null> {
    if (!CONFIG.collectorSourcing.enabled) return null

    /* prettier-ignore */ console.log(`Collector: getTransactionReceipt call for txHash: ${txHash}`)
    const requestConfig: AxiosRequestConfig = {
      method: 'get',
      url: `${this.baseUrl}/api/transaction?txHash=${txHash}`,
      headers: this.defaultHeaders,
    }
    try {
      const res = await axiosWithRetry<{ success: boolean; transactions: any }>(requestConfig)
      /* prettier-ignore */ if (verbose) console.log(`Collector: getTransactionReceipt res: ${JSON.stringify(res.data)}`)
      if (!res.data.success) return null

      const result = res.data.transactions ? res.data.transactions[0] : null

      /* prettier-ignore */ if (verbose) console.log(`Collector: getTransactionReceipt result: ${JSON.stringify(result)}`)
      return result
    } catch (error) {
      console.error('Collector: Error getting transaction receipt', error)
      return null
    }
  }

  async getTxReceiptDetails(txHash: string): Promise<any | null> {
    if (!CONFIG.collectorSourcing.enabled) return null

    /* prettier-ignore */ console.log(`Collector: getTxReceiptDetails call for txHash: ${txHash}`)
    try {
      const apiQuery = `${this.baseUrl}/api/transaction?txHash=${txHash}`
      const response = await axios.get(apiQuery).then((response) => {
        if (!response) {
          throw new Error('Failed to fetch transaction')
        } else return response
      })
      /* prettier-ignore */ if (verbose) console.log(`Collector: getTxReceiptDetails /api/transaction response: ${JSON.stringify(response.data)}`)

      const txId = response.data.transactions[0].txId
      const receiptQuery = `${this.baseUrl}/api/receipt?txId=${txId}`
      const receipt = await axios.get(receiptQuery).then((response) => response.data.receipts)
      return receipt
    } catch (error) {
      console.error('Collector: Error getting transaction receipt details', error)
      return null
    }
  }

  async getStorage(txHash: string): Promise<{ key: string; value: string }[] | null> {
    if (!CONFIG.collectorSourcing.enabled) return null

    const receipt = await this.getTxReceiptDetails(txHash)
    if (!receipt) {
      return null
    }
    const beforeStates: any[] = receipt.beforeStateAccounts
    const storageRecords = beforeStates.map((account) => {
      return {
        key: `${account.data.key}`,
        value: bufferToHex(account.data.value.data),
      }
    })
    return storageRecords
  }

  async getBlock(
    block: string,
    inpType: 'hex_num' | 'hash' | 'tag',
    details = false
  ): Promise<readableBlock | null> {
    if (!CONFIG.collectorSourcing.enabled) return null

    /* prettier-ignore */ console.log(`Collector: getBlock call for block: ${block}`)
    try {
      let blockQuery
      if (inpType === 'hex_num') {
        // int to hex
        blockQuery = `${this.baseUrl}/api/blocks?numberHex=${block}`
      } else {
        blockQuery = `${this.baseUrl}/api/blocks?hash=${block}`
      }
      /* prettier-ignore */ if (verbose) console.log(`Collector: getBlock blockQuery: ${blockQuery}`)

      const response = await axios.get(blockQuery).then((response) => response.data)
      if (!response.success) return null

      const { readableBlock, number } = response
      const blockNumber = number
      const resultBlock = readableBlock
      const txQuery = `${this.baseUrl}/api/transaction?blockNumber=${blockNumber}`

      resultBlock.transactions = await axios
        .get(txQuery)
        .then((response) => {
          if (!response.data.success) return []
          return response.data.transactions.map((tx: any) => {
            if (details === true) {
              tx.originalTxData = JSON.parse(tx.originalTxData)
              return this.decodeTransaction(tx)
            }
            return tx.wrappedEVMAccount.readableReceipt.transactionHash
          })
        })
        .catch((e) => {
          console.error('collector.getBlock could not get txs for the block', e)
          return []
        })

      return resultBlock
    } catch (e) {
      console.error('An error occurred for Collector.getBlock:', e)
      return null
    }
  }

  async fetchTxHistory(key: string, timestamp: number): Promise<{ accountId: any; data: any } | null> {
    if (!CONFIG.collectorSourcing.enabled) return null

    /* prettier-ignore */ console.log(`Collector: fetchAccount call for key: ${key}`)
    const accountKey = `0x${key.slice(0, -24)}`
    const apiQuery = `${this.baseUrl}/api/transaction?address=${accountKey}&beforeTimestamp=${timestamp}`

    const txCount = await axios.get(apiQuery).then((response) => response.data.totalTransactions)
    if (txCount === 0) {
      // Account does not exist!
      /* prettier-ignore */ console.log(`Collector: fetchAccount account does not exist for key: ${key}`)
      return null
    }

    let i = 1
    const numberOfPages = Math.ceil(txCount / 10)
    for (i; i <= numberOfPages; i++) {
      // Fetch current page
      const txList = await axios
        .get(apiQuery.concat(`&page=${i}`))
        .then((response) => response.data.transactions)
        .then((txList) =>
          txList.map((tx: { txId: string; timestamp: number }) => {
            return { txId: tx.txId, timestamp: tx.timestamp }
          })
        )

      for (const tx of txList) {
        const foundAccount = await axios
          .get(`${this.baseUrl}/api/receipt?txId=${tx.txId}`)
          .then((response) => response.data.receipts.accounts)
          .then((accounts) => {
            return accounts.find((account: { accountId: string }) => account.accountId === key)
          })

        if (foundAccount) {
          return {
            accountId: foundAccount.accountId,
            data: foundAccount.data,
          }
        }
      }
    }

    return null
  }

  async fetchAccount(accountId: string) {
    const apiQuery = `${this.baseUrl}/api/address?accountId=${accountId}`
      const response = await axios.get(apiQuery).then((response) => {
        if (!response) {
          throw new Error('Failed to fetch transaction')
        } else return response
      })
      return response
  }

  buildLogAPIUrl(request: any, baseDomain = CONFIG.explorerUrl): string {
    const apiUrl = `${baseDomain}/api/v2/logs`
    const queryParams: string[] = []

    // Check if each query parameter exists in the request object and add it to the queryParams array if it does
    if (typeof request.address === 'string') {
      queryParams.push(`address=${request.address}`)
    }
    if (Array.isArray(request.address)) {
      queryParams.push(`address=${JSON.stringify(request.address)}`)
    }
    if (request.topics && request.topics.length > 0) {
      queryParams.push(`topics=${JSON.stringify(request.topics)}`)
    }
    if (request.fromBlock) {
      queryParams.push(`fromBlock=${request.fromBlock}`)
    }
    if (request.toBlock) {
      queryParams.push(`toBlock=${request.toBlock}`)
    }
    if (request.blockHash) {
      queryParams.push(`blockHash=${request.blockHash}`)
    }
    // Combine the base URL with the query parameters
    return `${apiUrl}${queryParams.length > 0 ? `?${queryParams.join('&')}` : ''}`
  }

  decodeTransaction(tx: any): readableTransaction {
    const readableReceipt = tx.wrappedEVMAccount.readableReceipt

    const raw = tx.originalTxData.raw as string

    let result: any = null
    let txObj = null

    try {
      txObj = TransactionFactory.fromSerializedData(toBuffer(raw))
    } catch (e) {
      // ok raw tx seem alien to @ethereum/tx version we have locked
      // fallback to collectors readable receipt
      // v, r, s are not available in readableReceipt
      return {
        hash: readableReceipt.transactionHash,
        blockHash: readableReceipt.blockHash,
        blockNumber: readableReceipt.blockNumber,
        type: '0x0',
        nonce: readableReceipt.nonce,
        to: readableReceipt.to,
        from: readableReceipt.from,
        gas: readableReceipt.gasUsed,
        value: readableReceipt.value,
        input: readableReceipt.input,
        gasPrice: readableReceipt.gasPrice,
        chainId: '0x' + CONFIG.chainId.toString(16),
        transactionIndex: readableReceipt.transactionIndex,
        v: '0x',
        r: '0x',
        s: '0x',
      } as readableLegacyTransaction
    }

    console.log(txObj)
    // Legacy Transaction
    result = {
      hash: readableReceipt.transactionHash,
      blockHash: readableReceipt.blockHash,
      blockNumber: readableReceipt.blockNumber,
      type: '0x' + txObj.type.toString(16), // <--- legacy tx is type 0
      nonce: '0x' + txObj.nonce.toString(16),
      to: txObj?.to?.toString(),
      from: txObj.getSenderAddress().toString(),
      gas: '0x' + txObj.gasLimit.toString(16),
      value: '0x' + txObj.value.toString('hex'),
      input: '0x' + txObj.data.toString('hex'),
      gasPrice: '0x' + txObj.getBaseFee().toString(16),
      chainId: '0x' + CONFIG.chainId.toString(16),
      transactionIndex: readableReceipt.transactionIndex,
      v: '0x' + txObj.v?.toString('hex'),
      r: '0x' + txObj.r?.toString('hex'),
      s: '0x' + txObj.s?.toString('hex'),
    } as readableLegacyTransaction

    // EIP-2930 Transaction
    if (txObj?.type === 1) {
      //typecast so that we can access AccessListJSON
      txObj = txObj as AccessListEIP2930Transaction
      result.accessList = txObj.AccessListJSON // <--- this is difference
      result.type = '0x' + txObj.type.toString(16)
      result = result as readableEIP2930Transaction
    }

    // EIP-1559 Transaction
    if (txObj?.type === 2) {
      //typecast so that we can access AccessListJSON, maxPriorityFeePerGas, maxFeePerGas
      txObj = txObj as FeeMarketEIP1559Transaction
      result.type = '0x' + txObj.type.toString(16)
      result.maxPriorityFeePerGas = '0x' + txObj.maxPriorityFeePerGas.toString(16)
      result.maxFeePerGas = '0x' + txObj.maxFeePerGas.toString(16)
      result.accessList = txObj.AccessListJSON
      result = result as readableEIP1559Transaction
    }

    // EIP-4844 Transaction
    // if(txObj?.type === 3) {
    // seem to be very new and not supported by the version of @ethereum/tx yet
    // we locked the version to 3.4.0
    // have to update the dependency to support this
    // which is not a priority at the moment and possibly be backward incompatible
    // }
    return result as readableTransaction
  }
}

interface readableReceipt {
  blockHash: string
  blockNumber: string
  from: string
  gas: string
  gasPrice: string
  hash: string
  input: string
  nonce: string
  to: string
  transactionIndex: string
  value: string
  contractAddress: string
  transactionHash: string
  gasUsed: string
}

interface completeReadableReceipt extends readableReceipt {
  cumulativeGasUsed: string
  data: string
  gasRefund: string
  logs: any[]
  logsBloom: string
  status: string
}

type readableBlock = {
  difficulty: string
  extraData: string
  gasLimit: string
  gasUsed: string
  hash: string
  logsBloom: string
  miner: string
  mixHash: string
  nonce: string
  number: string
  parentHash: string
  receiptsRoot: string
  sha3Uncles: string
  size: string
  stateRoot: string
  timestamp: string
  totalDifficulty: string
  transactions: string[] | completeReadableReceipt[]
  transactionsRoot: string
  uncles: string[]
}

type readableLegacyTransaction = {
  hash: string
  blockHash: string
  blockNumber: string
  type: string
  nonce: string
  to: string
  from: string
  gas: string
  value: string
  input: string
  gasPrice: string
  chainId: string
  v: string
  r: string
  s: string
  transactionIndex: string
}

type readableEIP2930Transaction = readableLegacyTransaction & {
  accessList: AccessList[]
}

type readableEIP1559Transaction = readableEIP2930Transaction & {
  maxPriorityFeePerGas: string
  maxFeePerGas: string
}

type readableTransaction = readableLegacyTransaction | readableEIP2930Transaction | readableEIP1559Transaction

export const collectorAPI = new Collector(CONFIG.collectorSourcing.collectorApiServerUrl)
