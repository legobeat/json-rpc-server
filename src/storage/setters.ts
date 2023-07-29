import { db } from './sqliteStorage'
import { InternalFilter } from '../types'

export const insertReplaceFilterData = async (filterId: string, filterData: InternalFilter) => {
  console.log('Inserting filter data into database.')
  const sql_string =
    `INSERT OR REPLACE INTO filter_data` +
    `(filterId, interalFilter) VALUES ` +
    `('${filterId}', '${JSON.stringify(filterData)}')`
  return await db.exec(sql_string)
}

export const deleteFilterData = async (filterId: string) => {
  console.log('Deleting filter data from database.')
  const sql_string = `DELETE FROM filter_data WHERE filterId='${filterId}'`
  return await db.exec(sql_string)
}
