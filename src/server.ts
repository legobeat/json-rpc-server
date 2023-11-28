import jayson from 'jayson'
import cors from 'cors'
import express, { NextFunction } from 'express'
import cookieParser from 'cookie-parser'
import { methods, saveTxStatus } from './api'
import { debug_info, setupLogEvents } from './logger'
import authorize from './middlewares/authorize'
import injectIP from './middlewares/injectIP'
import { setupDatabase } from './storage/sqliteStorage'
import {
  changeNode,
  setConsensorNode,
  updateNodeList,
  RequestersList,
  checkArchiverHealth,
  sleep,
} from './utils'
import { router as logRoute } from './routes/log'
import { router as authenticate } from './routes/authenticate'
import { Request, Response } from 'express'
import { CONFIG as config } from './config'
import blackList from '../blacklist.json'
import spammerList from '../spammerlist.json'
import path from 'path'

/**
 * This file contains the main server code for the JSON-RPC server.
 * It sets up the server, handles routes, and initializes necessary middleware and configurations.
 */

// const path = require('path');
// var whitelist = ['http://example1.com', 'http://example2.com']
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }

// initialize the server
const app = express()
const server = new jayson.Server(methods)
let port = config.port //8080
const chainId = config.chainId //8080

// parse port from args
const myArgs = process.argv.slice(2)
if (myArgs.length > 0) {
  port = parseInt(myArgs[0])
  config.port = port
  console.log(`json-rpc-server port console override to:${port}`)
}

//maybe catch unhandled exceptions?
process.on('uncaughtException', (err) => {
  console.log('uncaughtException:' + err)
})
process.on('unhandledRejection', (err) => {
  console.log('unhandledRejection:' + err)
})

app.set('trust proxy', true)

// add configurations to the server
app.use(cors({ methods: ['POST'] }))
app.use(express.json())
app.use(cookieParser())



if(config.dashboard.enabled && config.dashboard.dist_path){
  const clientDirectory = config.dashboard.dist_path[0] === '/' ? 
    config.dashboard.dist_path : path.resolve(config.dashboard.dist_path);
  const staticDirectory = path.join(clientDirectory,'static');
  console.log(path.join(clientDirectory,'index.html'));
  app.set('views', clientDirectory);
  app.use('/static',express.static(staticDirectory));
  // app.set('views', clientDirectory);

  /**
   * @route GET /dashboard
   */
  app.get('/dashboard', function (req, res) {
    return res.sendFile(path.join(clientDirectory,'index.html'));
  });
}

/**
 * @route GET /api/subscribe
 */
app.get('/api/subscribe', (req: Request, res: Response) => {
  const query = req.query
  // makes sure the ip and port are valid
  if (!query || !req.ip || !query.port) {
    console.log('Invalid ip or port')
    return res.end('Invalid ip or port')
  }
  const ip = req.ip || 'localhost'
  const port = req.connection.localPort || 9001
  changeNode(ip, port)
  res.end(`Successfully changed to ${ip}:${port}`)
})

/**
 * @route GET /api/health
 */
app.get('/api/health', (req: Request, res: Response) => {
  return res.json({ healthy: true }).status(200)
})

const requestersList = new RequestersList(blackList, spammerList)

// add custom middleware for the rate limit of requests
app.use(async (req: Request, res: Response, next: NextFunction) => {
  if (!config.rateLimit) {
    next()
    return
  }
  let ip = req.ip || 'localhost'
  if (ip.substr(0, 7) == '::ffff:') {
    ip = ip.substr(7)
  }
  //console.log('IP is ', ip)

  const reqParams = req.body.params
  const isRequestOkay = await requestersList.isRequestOkay(ip, req.body.method, reqParams)
  if (!isRequestOkay) {
    if (config.rateLimitOption.softReject) {
      const randomSleepTime = 10 + Math.floor(Math.random() * 10)
      await sleep(randomSleepTime * 1000)
      res.status(503).send('Network is currently busy. Please try again later.')
      return
    } else {
      res.status(503).send('Rejected by rate-limiting')
      return
    }
  }
  next()
})

// add log and authenticate routes
app.use('/log', authorize, logRoute)
app.use('/authenticate', authenticate)
app.use(injectIP)

// add jayson middleware
app.use(server.middleware())


updateNodeList(true).then(() => {
  debug_info.interfaceRecordingStartTime = config.statLog ? Date.now() : 0
  debug_info.txRecordingStartTime = config.recordTxStatus ? Date.now() : 0
  setConsensorNode()
  setInterval(updateNodeList, config.nodelistRefreshInterval)
  setInterval(saveTxStatus, 5000)
  setInterval(checkArchiverHealth, 60000)

  // start the server
  app.listen(port, function() {
    console.log(`JSON RPC Server listening on port ${port} and chainId is ${chainId}.`)
    setupDatabase()
    setupLogEvents()
  })
})
