
export interface IDX_COLLECTOR_CONFIG {
  database: {
    type: DB,
    /**
     * ignored if type is sqlite
     * */
    host: string,

    /**
     * ignored if type is sqlite
     * */
    port: number,

    /**
     * ignored if type is sqlite
     * */
    username: string,

    /**
     * ignored if type is sqlite
     * */
    password: string,

    /**
     * ignored if type is sqlite
     * */
    name: string,

    /**
     * Path to sqlite3 database file
     * ignored if type is not sqlite
     * */
    disk_path: string,
  }
}

export enum DB {
  SQLITE = 'sqlite',
  POSTGRESQL = 'postgresql',
}

const IDX_COLLECTOR_CONFIG: IDX_COLLECTOR_CONFIG = {
  database: {
    type: DB.SQLITE,
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '',
    name: 'idx_collector',
    disk_path: './collector_dumps/sqlite_db/cached_network_data.sqlite3',
  }
}

export default IDX_COLLECTOR_CONFIG
