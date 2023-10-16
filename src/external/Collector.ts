/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import { buildLogAPIUrl, verbose } from '../api'
import { CONFIG } from '../config'
import { LogQueryRequest } from '../types'

class Collector {
  URL: string
  constructor(baseURL: string) {
    this.URL = baseURL
  }

  async getLogsByFilter(request: LogQueryRequest): Promise<any[]> {
    if (!CONFIG.collectorSourcing.enabled) return []

    /* prettier-ignore */ if (verbose) console.log(`Collector: getLogsByFilter call for request: ${JSON.stringify(request)}`)

    let filteredLogs: any[] = []
    let currentPage = 1

    try {
      if (request == null) return []
      const baseUrl = buildLogAPIUrl(request, this.URL)
      const fullUrl = baseUrl + `&page=${currentPage}`
      if (CONFIG.verbose) console.log(`getLogsFromCollector fullUrl: ${fullUrl}`)
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
    try {
      const fullUrl = `${this.URL}/api/transaction?txHash=${txHash}`
      const res = await axios.get(fullUrl)

      if (verbose) {
        console.log('url', `${this.URL}/api/transaction?txHash=${txHash}`)
        console.log('res', JSON.stringify(res.data))
      }

      if (!res.data.success) return null

      const result = res.data.transactions
        ? res.data.transactions[0]
          ? res.data.transactions[0].wrappedEVMAccount.readableReceipt
          : null
        : null

      if (verbose) {
        console.log(`local_receipt sourced: ${result}`)
      }

      return result
    } catch (error) {
      console.error('An error occurred:', error)
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

export const collectorAPI = new Collector(CONFIG.collectorSourcing.collectorApiServerUrl)
