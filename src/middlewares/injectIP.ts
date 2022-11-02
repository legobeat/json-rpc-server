import { bufferToHex } from "ethereumjs-util"
import { getTransactionObj } from "../utils"

const util = require('util')
const CONFIG = require('../config')

const injectIP = (req: any, res:any, next: Function) => {
    if (req.body.method === 'eth_sendRawTransaction' && CONFIG.recordTxStatus) {
        let ip = req.ip
        if (ip.substr(0, 7) == '::ffff:') {
          ip = ip.substr(7)
        }
        req.body.params[1000] = ip
    }
    next()
    return 
}


export default injectIP;
