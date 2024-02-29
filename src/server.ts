import jayson from 'jayson'
import cors from 'cors'
import express, { NextFunction } from 'express'
import * as http from 'http'
import * as WebSocket from 'ws'
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
  cleanBadNodes,
} from './utils'
import { router as logRoute } from './routes/log'
import { router as authenticate } from './routes/authenticate'
import { Request, Response } from 'express'
import { CONFIG, CONFIG as config } from './config'
import blackList from '../blacklist.json'
import spammerList from '../spammerlist.json'
import path from 'path'
import { onConnection, setupSubscriptionEventHandlers } from './websocket'
import rejectSubscription from './middlewares/rejectSubscription'
import { setupEvmLogProviderConnectionStream } from './websocket/log_server'
import { setupArchiverDiscovery } from '@shardus/archiver-discovery'
import { setDefaultResultOrder } from 'dns'
setDefaultResultOrder('ipv4first')

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
const app = express()
const server = new jayson.Server(methods)
let port = config.port //8080
const chainId = config.chainId //8080

const extendedServer = http.createServer(app)

const wss = new WebSocket.Server({ server: extendedServer })

if (CONFIG.websocket.enabled) {
  wss.on('connection', onConnection)
}

const myArgs = process.argv.slice(2)
if (myArgs.length > 0) {
  port = parseInt(myArgs[0])
  config.port = port
  console.log(`json-rpc-server port console override to:${port}`)
}

export const ipport = CONFIG.ip + '__' + CONFIG.port
//maybe catch unhandled exceptions?
process.on('uncaughtException', (err) => {
  console.log('uncaughtException:' + err)
})
process.on('unhandledRejection', (err) => {
  console.log('unhandledRejection:' + err)
})

app.set('trust proxy', true)
app.use(cors({ methods: ['POST'] }))
app.use(express.json())
app.use(cookieParser())

// Logic to add security headers
app.use((req, res, next) => {
  res.append('X-Content-Type-Options', 'nosniff')
  res.append('poweredByHeader', 'false')
  res.append(
    'Permissions-Policy',
    'accelerometer=(), ambient-light-sensor=(), autoplay=(), battery=(), camera=(), cross-origin-isolated=(), display-capture=(), document-domain=(), encrypted-media=(), execution-while-not-rendered=(), execution-while-out-of-viewport=(), fullscreen=(), geolocation=(), gyroscope=(), keyboard-map=(), magnetometer=(), microphone=(), midi=(), navigation-override=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), sync-xhr=(), usb=(), web-share=(), xr-spatial-tracking=(), clipboard-read=(), clipboard-write=(), gamepad=(), speaker-selection=(), conversion-measurement=(), focus-without-user-activation=(), hid=(), idle-detection=(), interest-cohort=(), serial=(), sync-script=(), trust-token-redemption=(), unload=(), window-placement=(), vertical-scroll=()'
  )
  res.append('X-Frame-Options', 'SAMEORIGIN')
  res.append('Content-Security-Policy', 'self')
  next()
})

if (config.dashboard.enabled && config.dashboard.dist_path) {
  const clientDirectory =
    config.dashboard.dist_path[0] === '/'
      ? config.dashboard.dist_path
      : path.resolve(config.dashboard.dist_path)
  const staticDirectory = path.join(clientDirectory, 'static')
  console.log(path.join(clientDirectory, 'index.html'))
  app.set('views', clientDirectory)
  app.use('/static', express.static(staticDirectory))
  // app.set('views', clientDirectory);
  app.get('/dashboard', function (req, res) {
    return res.sendFile(path.join(clientDirectory, 'index.html'))
  })
}

app.get('/api/subscribe', authorize, (req: Request, res: Response) => {
  const query = req.query
  if (!query || !req.ip || !query.port) {
    console.log('Invalid ip or port')
    return res.end('Invalid ip or port')
  }
  const ip = req.ip || '127.0.0.1'
  const port = req.connection.localPort || 9001
  const success = changeNode(ip, port, true)
  if (!success) {
    res.end(`Ip not in the nodelist ${ip}:${port}, node subscription rejected`)
    return
  }
  res.end(`Successfully changed to ${ip}:${port}`)
})

app.get('/api/health', (req: Request, res: Response) => {
  return res.json({ healthy: true }).status(200)
})

const requestersList = new RequestersList(blackList, spammerList)

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.status === 400 || err.status === 401 || err.status === 403 || err.status === 404) {
    const formattedError = {
      status: err.statusCode,
      message: err.message,
    }
    return res.status(err.statusCode).json(formattedError) // Bad request
  }
  next()
})

app.use(async (req: Request, res: Response, next: NextFunction) => {
  if (!config.rateLimit) {
    next()
    return
  }
  let ip = req.ip
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

app.use('/log', authorize, logRoute)
app.use('/authenticate', authenticate)
app.use(injectIP)
// reject subscription methods from http
app.use(rejectSubscription)
app.use(server.middleware())

setupArchiverDiscovery({
  customConfigPath: 'archiverConfig.json',
}).then(() => {
  console.log('Finished setting up archiver discovery!')
  updateNodeList(true).then(() => {
    debug_info.interfaceRecordingStartTime = config.statLog ? Date.now() : 0
    debug_info.txRecordingStartTime = config.recordTxStatus ? Date.now() : 0
    setConsensorNode()
    setInterval(updateNodeList, config.nodelistRefreshInterval)
    setInterval(saveTxStatus, 5000)
    setInterval(checkArchiverHealth, 60000)
    setInterval(cleanBadNodes, 60000)
    extendedServer.listen(port, function () {
      console.log(`JSON RPC Server listening on port ${port} and chainId is ${chainId}.`)
      setupDatabase()
      setupLogEvents()
      setupSubscriptionEventHandlers()
      setupEvmLogProviderConnectionStream()
    })
  })
})
