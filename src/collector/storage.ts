import Database from 'better-sqlite3'
import { CONFIG as rpcConfig } from '../config'
import { LogFilter } from '../types'
import IDX_COLLECTOR_CONFIG from './config'
import { verbose } from './index'
import * as Types from '../types'

class Sqlite3Adapter {
  db: any

  constructor(path: string) {
    const db = new Database(path)
    console.log('Collector Database Attached')
    this.db = db
  }

  exec(sql: string): void {
    this.db.exec(sql)
  }

  async getReadableReceiptByHash(hash: hexString): Promise<readableReceipt | null> {
    try {
      const txHash = hash
      const { txId } = await this.db.prepare('SELECT txId FROM originalTxsData2 WHERE txHash = ?').get(txHash)
      let { receipt } = await this.db.prepare('SELECT receipt FROM receipts WHERE receiptId = ?').get(txId)
      receipt = JSON.parse(receipt)
      verbose(4, `local_receipt sourced: ${JSON.stringify(receipt.data.readableReceipt)}`)
      return receipt.data.readableReceipt
    } catch (e) {
      verbose(1, `Error: ${e}`)
      return null
    }
  }

  async getCompleteReadableReceiptByHash(hash: hexString): Promise<completeReadableReciept | null> {
    try {
      const txHash = hash
      const { txId } = await this.db.prepare('SELECT txId FROM originalTxsData2 WHERE txHash = ?').get(txHash)
      let { receipt } = await this.db.prepare('SELECT receipt FROM receipts WHERE receiptId = ?').get(txId)
      receipt = JSON.parse(receipt)
      verbose(4, `local_receipt sourced: ${JSON.stringify(receipt.data.readableReceipt)}`)
      return receipt.data.readableReceipt
    } catch (e) {
      verbose(1, `Error: ${e}`)
      return null
    }
  }

  async getBalanceByAddress(address: hexString): Promise<hexString | null> {
    try {
      const { account } = await this.db
        .prepare('SELECT account FROM accounts WHERE ethAddress = ?')
        .get(address.toLowerCase())
      const { balance } = JSON.parse(account)
      return balance
    } catch (e) {
      verbose(1, `Error: ${e}`)
      return null
    }
  }

  async getTransactionCountByAddress(address: string): Promise<hexString | null> {
    try {
      const { account } = await this.db
        .prepare('SELECT account FROM accounts WHERE ethAddress = ?')
        .get(address.toLowerCase())

      const { nonce } = JSON.parse(account).account

      verbose(4, `local_nonce sourced: ${nonce}`)

      return nonce // as hexadecimal string
    } catch (e) {
      verbose(1, `Error: ${e}`)
      return null
    }
  }

  async getLogsByFilter(filter: LogFilter): Promise<any[]> {
    try {

      const sql = this.createSqlFromEvmLogFilter(filter)
      console.log(sql);
      let logs = await this.db.prepare(sql).all();
      logs = logs.map((log: any) => JSON.parse(log.log))
      return logs
    } catch (e) {
      verbose(1, `Error: ${e}`)
      return []
    }
  }

  createSqlFromEvmLogFilter(filter: LogFilter): string{
      const { fromBlock, toBlock, address, topics, blockHash } = filter
      let sql = `SELECT log FROM logs WHERE contractAddress LIKE '%${address.toLowerCase()}%'`

      if(blockHash){
        sql += ` AND blockHash = '${blockHash}'`
      }
      else{
        if(fromBlock == 'latest'){
          sql += ` AND blockNumber >= (
                        SELECT MAX(blockNumber)
                        FROM logs
                  )`
        }
        if(fromBlock == 'earliest'){
          // genesis block
          sql += ` AND blockNumber >= 0`
        }
        if(fromBlock && fromBlock !== 'latest' && fromBlock !== 'earliest') {
          sql += ` AND blockNumber >= ${Number(fromBlock)}`;
        }

        if(toBlock == 'latest'){
          sql += ` AND blockNumber <= (
                        SELECT MAX(blockNumber)
                        FROM logs
                  )`
        }
        if(toBlock == 'earliest'){
          // genesis block
          sql += ` AND blockNumber <= 0`
        }
        if(toBlock && toBlock !== 'latest' && toBlock !== 'earliest') {
          sql += ` AND blockNumber <= ${Number(toBlock)}`;
        }
      }

      if(topics[0]) {
        sql += ` AND topic0 LIKE '%${topics[0]}%'`
      }
      if(topics[1]) {
        sql += ` AND topic1 LIKE '%${topics[1]}%'`
      }
      if(topics[2]) {
        sql += ` AND topic2 LIKE '%${topics[2]}%'`
      }
      if(topics[3]) {
        sql += ` AND topic3 LIKE '%${topics[3]}%'`
      }
      if(topics[4]) {
        sql += ` AND topic4 LIKE '%${topics[4]}%'`
      }
      sql += ` ORDER BY blockNumber ASC LIMIT 10000;`
      return sql;
  }

  async getLatestBlockNumber(): Promise<number | null> {
    try {
      const { blockNumber } = await this.db
        .prepare('SELECT MAX(blockNumber) AS blockNumber FROM logs')
        .get()
      verbose(4, `Extracting blockNumber from latest transaction: ${blockNumber}`)


      return blockNumber
    } catch (e) {
      verbose(1, `Error in extracting blockNumber from latest transaction: ${e}`)
      return null
    }
  }

  async getBlockNumberByBlockHash(blockHash: string): Promise<number | null> {
    try {
      const { blockNumber } = await this.db
        .prepare('SELECT blockNumber FROM transactions WHERE blockHash = ?')
        .get(blockHash)

      verbose(4, `Extracting blockNumber by BlockHash: ${blockNumber}`)

      return blockNumber
    } catch (e) {
      verbose(1, `Error in extracting  blockNumber by BlockHash: ${e}`)
      return null
    }
  }

  prepare(sql: string): any {
    return this.db.prepare(sql)
  }

}

export const collectorDatabase: Sqlite3Adapter = new Sqlite3Adapter(IDX_COLLECTOR_CONFIG.database.disk_path)

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
  data: string
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

type hexString = string

type BlockNumberResult = {
  blockNumber: number
}
