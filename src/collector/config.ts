import path from "node:path"

interface collector_config {
  database: {
    /**
     * Path to sqlite3 database file
     * ignored if type is not sqlite
     * */
    disk_path: string,
  }
  /**
  1 errors
  2 errors + warnings
  3 errors + warnings + info
  4 errors + warnings + info + all
  **/
  verbosity: 1 | 2 | 3 | 4,
}

export enum DB {
  SQLITE = 'sqlite',
  POSTGRESQL = 'postgresql',
}

const IDX_COLLECTOR_CONFIG: collector_config = {
  database: {
    disk_path: path.resolve('./../../shardus/relayer/collector/db.sqlite3')
  },
  verbosity: 4,
}

export default IDX_COLLECTOR_CONFIG
