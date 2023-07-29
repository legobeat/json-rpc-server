import { db } from './sqliteStorage'

export const getFilterData = async (filterId: string) => {
    console.log("Getting filter data from database.")
    const sql_string = `SELECT * FROM filter_data WHERE filterId='${filterId}'`

    const rows = await db.prepare(sql_string).all();
    for (const row of rows) {
      row.data = JSON.parse(row.data);
    }
    return {
      rowCount: rows.length,
      rows: rows
    }
}

