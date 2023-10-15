import axios from "axios";
import { buildLogAPIUrl } from "../api";
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
}



export const collectorAPI = new Collector(CONFIG.collectorSourcing.collectorApiServerUrl)
