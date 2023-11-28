import {CONFIG} from '../config'
import { NextFunction, Request, Response } from 'express'

/**
 * This file contains a middleware function to inject the client IP address into the request body.
 * This is used to record the IP address of the client that submitted a transaction.
 */
const injectIP = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.method === 'eth_sendRawTransaction' && CONFIG.recordTxStatus) req.body.params[1000] = req.ip
  next()
  return
}

export default injectIP
