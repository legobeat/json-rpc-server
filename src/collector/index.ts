import axios from "axios";
import { buildLogAPIUrl, verbose } from "../api";
import { CONFIG } from "../config";
import { LogFilter, LogQueryRequest } from "../types";


class Collector{
  URL: string
  constructor(baseURL: string) {
    this.URL = baseURL
  }

 async getLogsByFilter(request: LogQueryRequest): Promise<any[]> {
    if (!CONFIG.collectorSourcing.enabled) return []
    let updates: any[] = []
    let currentPage = 1

    try {
      if (request == null) return []
      let baseUrl = buildLogAPIUrl(request, this.URL)
      let fullUrl = baseUrl + `&page=${currentPage}`
      if (CONFIG.verbose) console.log(`getLogsFromCollector fullUrl: ${fullUrl}`)
      let res = await axios.get(fullUrl)

      if (res.data && res.data.success && res.data.logs.length > 0) {
        const logs = res.data.logs.map((item: any) => item.log)
        updates = updates.concat(logs)
        currentPage += 1
        const totalPages = res.data.totalPages
        while (currentPage <= totalPages) {
          res = await axios.get(`${baseUrl}&page=${currentPage}`)
          if (res.data && res.data.success) {
            const logs = res.data.logs.map((item: any) => item.log)
            updates = updates.concat(logs)
          }
          currentPage += 1
        }
      }
    } catch (e) {
      console.error(`Error getting filter updates`, e)
      return []
    }
    return updates
  }

 async getTransactionByHash(txHash: string): Promise<readableReceipt | null> {
    try {
      let fullUrl = `${this.URL}/api/transaction?txHash=${txHash}`;
      let res = await axios.get(fullUrl);
      
      if (verbose) {
        console.log('url', `${this.URL}/api/transaction?txHash=${txHash}`);
        console.log('res', JSON.stringify(res.data));
      }

      if(!res.data.success) return null

      let result = res.data.transactions
        ? res.data.transactions[0]
          ? res.data.transactions[0].wrappedEVMAccount.readableReceipt
          : null
        : null;

      if (verbose) { 
        console.log(`local_receipt sourced: ${result}`);
      }
      
      return result;
    } catch (error) {
      console.error('An error occurred:', error);
      return null;
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
