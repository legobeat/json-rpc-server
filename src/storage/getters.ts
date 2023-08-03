import { db } from './sqliteStorage';

export const getFilterData = async (filterId: string) => {
  console.log('Getting filter data from the database.');
  const sql_string = `SELECT * FROM filter_data WHERE filterId='${filterId}'`;

  const row = await db.prepare(sql_string).get();
  console.log('Got filter data from the database.', row);

  if (row) {
    if (row.internalFilter) {
      try {
        row.internalFilter = JSON.parse(row.internalFilter);
      } catch (error) {
        console.error("Error parsing internalFilter:", error);
        // Handle the case where the 'internalFilter' field is not valid JSON.
        // You can choose to handle the error in any appropriate way.
        // For example, you can set row.internalFilter to null or an empty object.
        row.internalFilter = null;
      }
    } else {
      // Handle the case where the 'internalFilter' field is empty or not provided.
      console.error("InternalFilter is empty or not provided.");
      row.internalFilter = null;
    }
  }

  return {
    rowCount: row ? 1 : 0,
    rows: row ? [row] : [],
  };
};
