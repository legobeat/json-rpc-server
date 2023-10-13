import { collectorDatabase } from "./storage";

;(async()=>{
 // const res = await collectorDatabase.getTransactionCountByAddress('0x10b9ACd5d9E718A075f08d4ae61cd11dAad0894C')
 console.log(await collectorDatabase.getLatestBlockNumber())
})();
