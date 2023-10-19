/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import { buildLogAPIUrl, verbose } from '../api'
import { CONFIG } from '../config'
import { LogQueryRequest } from '../types'
import { BaseExternal } from './BaseExternal'
import { bufferToHex } from 'ethereumjs-util'


class Collector extends BaseExternal {
  constructor(baseURL: string) {
    super(baseURL, 3, {
      'Content-Type': 'application/json',
    })
  }

  async getLogsByFilter(request: LogQueryRequest): Promise<any[]> {
    if (!CONFIG.collectorSourcing.enabled) return []

    /* prettier-ignore */ if (verbose) console.log(`Collector: getLogsByFilter call for request: ${JSON.stringify(request)}`)

    let filteredLogs: any[] = []
    let currentPage = 1

    try {
      if (request == null) return []
      const baseUrl = buildLogAPIUrl(request, this.baseUrl)
      const fullUrl = baseUrl + `&page=${currentPage}`
      /* prettier-ignore */ if (CONFIG.verbose) console.log(`Collector: getLogsFromCollector fullUrl: ${fullUrl}`)
      let res = await axios.get(fullUrl)

      if (res.data && res.data.success && res.data.logs.length > 0) {
        const logs = res.data.logs.map((item: any) => item.log)
        filteredLogs = filteredLogs.concat(logs)
        currentPage += 1
        const totalPages = res.data.totalPages
        while (currentPage <= totalPages) {
          res = await axios.get(`${baseUrl}&page=${currentPage}`)
          if (res.data && res.data.success) {
            const logs = res.data.logs.map((item: any) => item.log)
            filteredLogs = filteredLogs.concat(logs)
          }
          currentPage += 1
        }
      }
    } catch (e) {
      console.error(`Collector: Error getting logs by filter`, e)
      return []
    }
    return filteredLogs
  }

  async getTransactionByHash(txHash: string): Promise<readableReceipt | null> {
    if (!CONFIG.collectorSourcing.enabled) return null

    /* prettier-ignore */ if (verbose) console.log(`Collector: getTransactionByHash call for txHash: ${txHash}`)
    const requestConfig = {
      method: 'get',
      url: `${this.baseUrl}/api/transaction?txHash=${txHash}`,
      headers: this.defaultHeaders,
    }

    try {
      const fullUrl = `${this.baseUrl}/api/transaction?txHash=${txHash}`
      /* prettier-ignore */ if (verbose) console.log(`Collector: getTransactionByHash fullUrl: ${fullUrl}`)
      const res = await axios.get(fullUrl)

      if (!res.data.success) return null

      const result = res.data.transactions
        ? res.data.transactions[0]
          ? res.data.transactions[0].wrappedEVMAccount.readableReceipt
          : null
        : null

      /* prettier-ignore */ if (verbose) console.log(`Collector: getTransactionByHash result: ${JSON.stringify(result)}`)
      return result
    } catch (error) {
      console.error('Collector: Error getting transaction by hash', error)
      return null
    }
  }

  async getTransactionReciept(txHash: string): Promise<completeReadableReciept | null> {
    if (!CONFIG.collectorSourcing.enabled) return null

    try {
      let fullUrl = `${this.baseUrl}/api/transaction?txHash=${txHash}`;
      let res = await axios.get(fullUrl);
      
      if (verbose) {
        console.log('url for getTransactionReciept', `${this.baseUrl}/api/transaction?txHash=${txHash}`);
        console.log('res getTransactionReciept', JSON.stringify(res.data));
      }

      if(!res.data.success) return null

      let result = res.data.transactions
        ? res.data.transactions[0]
          ? res.data.transactions[0].wrappedEVMAccount.readableReceipt
          : null
        : null;

      if (verbose) { 
        console.log(`local_receipt sourced for getTransactionReciept: ${result}`);
      }
      
      return result;
    } catch (error) {
      console.error('An error occurred for getTransactionReciept:', error);
      return null;
    }
  }

  async fetchLocalTxReceipt(txHash: string, hashReceipt = false) {
    if (!CONFIG.collectorSourcing.enabled) return null

    const apiQuery = `${this.baseUrl}/api/transaction?txHash=${txHash}`
    const response = await axios.get(apiQuery).then((response) => {
      if (!response) {
        throw new Error('Failed to fetch transaction')
      } else return response
    })
  
    if (hashReceipt) {
      return response.data.transactions[0]
    }
  
    const txId = response.data.transactions[0].txId
    const receiptQuery = `${this.baseUrl}/api/receipt?txId=${txId}`
    const receipt = await axios.get(receiptQuery).then((response) => response.data.receipts)
    return receipt
  }
  
  async fetchLocalStorage(txHash: string) {
    if (!CONFIG.collectorSourcing.enabled) return null

    const receipt = await this.fetchLocalTxReceipt(txHash)
    const beforeStates: any[] = receipt.beforeStateAccounts
    const storageRecords = beforeStates.map((account) => {
      return {
        key: `${account.data.key}`,
        value: bufferToHex(account.data.value.data),
      }
    })
    return storageRecords
  }

  async getBlock(key: string | number): Promise<any | null>{
    if (!CONFIG.collectorSourcing.enabled) return null
    try{
      let apiQuery = `${this.baseUrl}/eth_getBlockByNumber?blockNumber=${key}`
      if(typeof key === 'string'){
        apiQuery = `${this.baseUrl}/eth_getBlockByHash?blockHash=${key}`
      }
      const response = await axios.get(apiQuery).then((response) => response.data)
      return response
    }catch(e){
      console.error('An error occurred for Collector.getBlock:', e)
      return null
    }
  }

}

type readableReceipt = {
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

type completeReadableReciept = {
  blockHash: string
  blockNumber: string
  contractAddress: string
  cumulativeGasUsed: string
  data: string
  from: string
  gasRefund: string
  gasUsed: string
  logs: any[]
  logsBloom: string
  nonce: string
  status: string
  to: string
  transactionHash: string
  transactionIndex: string
  value: string
}


export const collectorAPI = new Collector(CONFIG.collectorSourcing.collectorApiServerUrl)
