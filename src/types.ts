export enum FilterTypes {
  log,
  block,
  pendingTransaction,
}

export type Topic = string | string[]
export type BaseFilterArgs = { id: string }
export type LogFilter = BaseFilterArgs & {
  address: string
  topics: Topic[]
  fromBlock?: string
  toBlock?: string
  blockHash?: string
  lastQueriedTimestamp: number
  lastQueriedBlock: number
  createdBlock: number
}
export type BlockFilter = BaseFilterArgs & {
  lastQueriedTimestamp: number
  lastQueriedBlock: number
  createdBlock: number
}
export type InternalFilter = {
  type: FilterTypes
  updates: any[]
  unsubscribe: Function
  filter: LogFilter | BlockFilter
}

export interface LogQueryRequest {
  address?: string
  topics?: Topic[]
  fromBlock?: string
  toBlock?: string
}
