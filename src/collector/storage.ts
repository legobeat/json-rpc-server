import Database from 'better-sqlite3'
import IDX_COLLECTOR_CONFIG from './config'
import { verbose } from './index'

class Sqlite3Adapter{
  db: any

  constructor(path: string) {
      const db = new Database(path)
      console.log('Collector Database Attached')
      this.db = db
  }

  exec(sql: string): void{
    this.db.exec(sql)
  }

  async getReadableReceiptByHash(hash: string): Promise<readableReceipt | null> {
    try{
      const txHash = hash;
      const { txId } = await this.db.prepare('SELECT txId FROM originalTxsData2 WHERE txHash = ?').get(txHash)
      let { receipt } = await this.db.prepare('SELECT receipt FROM receipts WHERE receiptId = ?').get(txId)
      receipt = JSON.parse(receipt)
      verbose(4, `local_receipt sourced: ${JSON.stringify(receipt.data.readableReceipt)}`)
      return receipt.data.readableReceipt
    }catch(e){
      verbose(1, `Error: ${e}`)
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

