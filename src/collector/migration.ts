import { db } from './storage'

async function createLocalDataTables(): Promise<void> {
  await db.exec(
    'CREATE TABLE if not exists `cycles` (`cycleMarker` TEXT NOT NULL UNIQUE PRIMARY KEY, `counter` NUMBER NOT NULL, `cycleRecord` JSON NOT NULL)'
  )
  await db.exec(
    'CREATE TABLE if not exists `accounts` (`accountId` TEXT NOT NULL UNIQUE PRIMARY KEY, `cycle` NUMBER NOT NULL, `timestamp` BIGINT NOT NULL, `ethAddress` TEXT NOT NULL, `account` TEXT NOT NULL, `hash` TEXT NOT NULL, `accountType` INTEGER NOT NULL, `contractInfo` JSON, `contractType` INTEGER)'
  )
  await db.exec(
    'CREATE TABLE IF NOT EXISTS gas_estimations ' +
      '(`contract_address` VARCHAR, `function_signature` VARCHAR, `gasEstimate` VARCHAR, `timestamp` BIGINT, ' +
      'PRIMARY KEY (`contract_address`, `function_signature`))'
  )
  await db.exec(
    'CREATE TABLE if not exists `transactions` (`txId` TEXT NOT NULL, `result` JSON NOT NULL, `cycle` NUMBER NOT NULL, `partition` NUMBER, `timestamp` BIGINT NOT NULL, `blockNumber` NUMBER NOT NULL, `blockHash` TEXT NOT NULL, `wrappedEVMAccount` JSON NOT NULL, `accountId` TEXT NOT NULL,  `txFrom` TEXT NOT NULL, `txTo` TEXT NOT NULL, `nominee` TEXT, `txHash` TEXT NOT NULL, `transactionType` INTEGER NOT NULL, `originalTxData` JSON, PRIMARY KEY (`txId`, `txHash`))'
  )

  await db.exec(
    'CREATE TABLE if not exists `logs` (`_id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, `cycle` NUMBER NOT NULL,' +
      ' `timestamp` BIGINT NOT NULL, `txHash` TEXT NOT NULL,  `blockNumber` NUMBER NOT NULL, `blockHash` TEXT NOT NULL, `contractAddress` TEXT NOT' +
      " NULL, `log` JSON NOT NULL, `topic0` TEXT NOT NULL, `topic1` TEXT, `topic2` TEXT, `topic3` TEXT, `inserted_at` BIGINT NOT NULL DEFAULT (CAST(strftime('%s','now') AS INTEGER)*1000))"
  )

  await db.exec(
    'CREATE TABLE if not exists `receipts` (`receiptId` TEXT NOT NULL UNIQUE PRIMARY KEY, `tx` JSON NOT NULL, `cycle` NUMBER NOT NULL, `timestamp` BIGINT NOT NULL, `result` JSON NOT NULL, `beforeStateAccounts` JSON, `accounts` JSON NOT NULL, `receipt` JSON, `sign` JSON NOT NULL)'
  )

  await db.exec(
    'CREATE TABLE if not exists `originalTxsData` (`txId` TEXT NOT NULL UNIQUE PRIMARY KEY, `timestamp` BIGINT NOT NULL, `cycle` NUMBER NOT NULL, `originalTxData` JSON NOT NULL, `sign` JSON NOT NULL)'
  )
}

function main(): void {
  createLocalDataTables()
}

main()
