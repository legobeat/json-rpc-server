import Database from 'better-sqlite3'
import fs from 'fs'
import IDX_COLLECTOR_CONFIG, {DB} from './config'

export const db: Sqlite3Adapter | PostgresAdapter = (()=>{
  if (IDX_COLLECTOR_CONFIG.database.type === DB.SQLITE) {
    return new Sqlite3Adapter(IDX_COLLECTOR_CONFIG.database.disk_path)
  }
  else if (IDX_COLLECTOR_CONFIG.database.type === DB.POSTGRESQL) {
    return new PostgresAdapter(
      IDX_COLLECTOR_CONFIG.database.username, 
      IDX_COLLECTOR_CONFIG.database.password, 
      IDX_COLLECTOR_CONFIG.database.host, 
      IDX_COLLECTOR_CONFIG.database.port, 
      IDX_COLLECTOR_CONFIG.database.name
    )
  }
  else{
    throw new Error('Database type not supported.')
  }
})();

class Sqlite3Adapter{
  db: any

  constructor(path: string) {
    let db = null;
    const dir = path.substring(0, path.lastIndexOf('/'))
    console.log(dir)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {recursive: true})
    }
    db = new Database(path)
    db.pragma('journal_mode = WAL')
    console.log('Database initialized.')
    this.db = db
  }

  exec(sql: string): void{
    this.db.exec(sql)
  }

  prepare(sql: string): any {
    return this.db.prepare(sql)
  }

}

class PostgresAdapter{
  db: never

  constructor(username: string, password: string, host: string, port: number, database: string) {
    throw new Error('Not implemented.')
  }

  exec(sql: string): void{
    throw new Error('Not implemented.')
  }

  prepare(sql: string): any{
    throw new Error('Not implemented.')
  }

}
