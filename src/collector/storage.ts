import Database from 'better-sqlite3'
import fs from 'fs'
import IDX_COLLECTOR_CONFIG, {DB} from './config'

export let db: any = initDatabase()

function sqlite3Adapter(path: string): any {
  // create path if not exist recursively
  const dir = path.substring(0, path.lastIndexOf('/'))
  console.log(dir)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {recursive: true})
  }
  db = new Database(path)
  db.pragma('journal_mode = WAL')
  console.log('Database initialized.')
  return db
}

function postgresAdapter(): any {
  // potential implement in future
}

function initDatabase(): void {
  console.log(IDX_COLLECTOR_CONFIG);
  if (IDX_COLLECTOR_CONFIG.database.type === DB.SQLITE) {
    return sqlite3Adapter(IDX_COLLECTOR_CONFIG.database.disk_path)
  }
  else if (IDX_COLLECTOR_CONFIG.database.type === DB.POSTGRESQL) {
    return postgresAdapter()
  }
  else{
    throw new Error('Database type not supported.')
  }
}


