# JSON-RPC API
![banner](../img/banner.png)

## Overview
The Shardeum JSON-RPC API is a collection of methods that allow you to interact with the Shardeum blockchain. The API is based on the [JSON-RPC 2.0](https://www.jsonrpc.org/specification) specification and is compatible with any JSON-RPC client. Instructions on setting up and running the Shardeum Server can be [here](../README.md).

## Endpoints
The JSON-RPC API endpoints are listed below.

<details>
  <summary><b>web3_clientVersion</b></summary>
  Returns the current version of the client

  ### Parameters
  None.

  ### Returns
  `result`: The current client version in string format.

  ## Examples

  ### Request
  ```bash
  curl https://<....> \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"web3_clientVersion","params": [],"id":1}'
  ```

  ### Response
  ```json
    {
        "jsonrpc":"2.0",
        "id":1,
        "result":"Mist/v0.9.3/darwin/go1.4.1"
    }
  ```
</details>


<details>
  <summary><b>eth_protocolVersion</b></summary>
  Returns the current Ethereum protocol version.

  ### Parameters
  None

  ### Returns
  `result`: A hexadecimal string indicating the current Ethereum protocol version

  ### Examples

  #### Request
  ```bash
  curl https://<....> \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_protocolVersion","params": [],"id":1}'
  ```

  #### Response
  ```json
    {
        "jsonrpc":"2.0",
        "id":1,
        "result":"54"
    }
  ```
</details>

<details>
  <summary><b>eth_coinbase</b></summary>
  Returns the client coinbase address.

  ### Parameters
  None

  ### Returns
  `result`: The client coinbase address.

  ## Examples

  ### Request
  ```bash
  curl https://<....> \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_coinbase","params": [],"id":1}'
  ```

  ### Response
  ```json
    {
        "jsonrpc":"2.0",
        "id":1,
        "result":"0x507877C2E26f1387432D067D2DaAfa7d0420d90a"
    }
  ```
</details>

<details>
  <summary><b>eth_gasPrice</b></summary>
  Returns the current gas price on the network.

  ### Parameters
  None

  ### Returns
  `result`: The current gas price in hexadecimal.

  ## Examples

  ### Request
  ```bash
  curl https://<....> \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_gasPrice","params": [],"id":1}'
  ```

  ### Response
  ```json
    {
        "jsonrpc":"2.0",
        "id":1,
        "result":"0x1dfd14000"
    }
  ```
  
</details>

<details>
  <summary><b>eth_blockNumber</b></summary>
  Returns the latest block number of the blockchain.

  ### Parameters
  None

  ### Returns
  `result`: The value of the latest block number encoded as hexadecimal.

  ## Examples

  ### Request
  ```bash
  curl https://<....> \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params": [],"id":1}'
  ```

  ### Response
  ```json
    {
        "jsonrpc":"2.0",
        "id":1,
        "result":"0x0"
    }
  ```
  
</details>

<details>
  <summary><b>eth_chainId</b></summary>
  Returns the current chain ID.

  ### Parameters
  None

  ### Returns
  `result`: The chain ID encoded as an hexadecimal string.

  ## Examples

  ### Request
  ```bash
  curl https://<....> \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_chainId","params": [],"id":1}'
  ```

  ### Response
  ```json
    {
        "jsonrpc":"2.0",
        "id":1,
        "result":"0x1"
    }
  ```
  
</details>

<details>
  <summary><b>net_version</b></summary>
  Returns the current network ID.

  ### Parameters
  None

  ### Returns
  `result`: The network ID encoded as an hexadecimal string.

  ## Examples

  ### Request
  ```bash
  curl https://<....> \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"net_version","params": [],"id":1}'
  ```

  ### Response
  ```json
    {
        "jsonrpc":"2.0",
        "id":1,
        "result":"0x1"
    }
  ```
  
</details>

<details>
  <summary><b>eth_mining</b></summary>
  Returns true if the node is actively mining new blocks.

  ### Parameters
  None.

  ### Returns
  `result`: `true` if the node is actively mining, `false` otherwise.

  ## Examples

  ### Request
  ```bash
  curl https://<....> \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_mining","params": [],"id":1}'
  ```

  ### Response
  ```json
    {
        "jsonrpc":"2.0",
        "id":1,
        "result":true
    }
  ```
  
</details>

<details>
  <summary><b>eth_hashrate</b></summary>
  Returns the number of hashes per second that the node is mining with.

  ### Parameters
  None.

  ### Returns
  `result`: The number of hashes per second in hexadecimal format.

  ## Examples

  ### Request
  ```bash
  curl https://<....> \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_hashrate","params": [],"id":1}'
  ```

  ### Response
  ```json
    {
        "jsonrpc":"2.0",
        "id":1,
        "result":"0x38a"
    }
  ```
  
</details>

<details>
  <summary><b>eth_syncing</b></summary>
  Returns an object with the sync status of the node if the node is out-of-sync and is synchronizing. Returns false when the node is already in sync.

  ### Parameters
  None.

  ### Returns
  `result`: The result is `false` if node is not synchronizing. Otherwise, it's an object with the following structure: 
  > startingBlock: String
  > > The block at which the import started encoded as hexadecimal 
  
  > currentBlock: String
  > > The current block, same as eth_blockNumber encoded as hexadecimal
  
  > highestBlock: String
  > > The estimated highest block encoded as hexadecimal

  ## Examples

  ### Request
  ```bash
  curl https://<....> \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_syncing","params": [],"id":1}'
  ```

  ### Response
  ```json
    {
        "jsonrpc":"2.0",
        "id":1,
        "result":"false"
    }
  ```
  
</details>

<details>
  <summary><b>net_peerCount</b></summary>
  Returns the number of peers currently connected to the client.

  ### Parameters
  None.

  ### Returns
  `result`: The number of peers currently connected to the client.

  ## Examples

  ### Request
  ```bash
  curl https://<....> \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"net_peerCount","params": [],"id":1}'
  ```

  ### Response
  ```json
    {
        "jsonrpc":"2.0",
        "id":1,
        "result":"0x2"
    }
  ```
  
</details>

<details>
  <summary><b>net_listening</b></summary>
  Returns true if client is actively listening for network connections.

  ### Parameters
  None.

  ### Returns
  `result`: `true` if the client is actively listening for network connections. `false` otherwise.

  ## Examples

  ### Request
  ```bash
  curl https://<....> \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"net_listening","params": [],"id":1}'
  ```

  ### Response
  ```json
    {
        "jsonrpc":"2.0",
        "id":1,
        "result":true
    }
  ```
  
</details>

<details>
  <summary><b>eth_accounts</b></summary>
  Returns an array of addresses owned by the client.

  ### Parameters
  None.

  ### Returns
  `result`: An array of addresses owned by the client.

  ## Examples

  ### Request
  ```bash
  curl https://<....> \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_accounts","params": [],"id":1}'
  ```

  ### Response
  ```json
    {
        "jsonrpc":"2.0",
        "id":1,
        "result":["0x407d73d8a49eeb85d32cf465507dd71d507100c1"]
    }
  ```
  
</details>

<details>
  <summary><b>eth_getBalance</b></summary>
  Returns the balance of given account address.

  ### Parameters
  `address`: The address to check for balance.

  ### Returns
  `result`: The balance of the specified address in hexadecimal value.

  ## Examples

  ### Request
  ```bash
  curl https://<....> \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_balance","params": ["0x507877C2E26f1387432D067D2DaAfa7d0420d90a"],"id":1}'
  ```

  ### Response
  ```json
    {
        "jsonrpc":"2.0",
        "id":1,
        "result":"0x0"
    }
  ```
  
</details>

<details>
  <summary><b>eth_getTransactionCount</b></summary>
  Returns the number of transactions sent from an address.

  ### Parameters
  `address`: The address from which to count transactions

  ### Returns
  `result`: The number of transactions sent from the given address in hexadecimal value.

  ## Examples

  ### Request
  ```bash
  curl https://<....> \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_getTransactionCount","params": ["0x507877C2E26f1387432D067D2DaAfa7d0420d90a"],"id":1}'
  ```

  ### Response
  ```json
    {
        "jsonrpc":"2.0",
        "id":1,
        "result":"0x0"
    }
  ```
  
</details>

<details>
  <summary><b>eth_getCode</b></summary>
  Returns the compiled bytecode of a smart contract.

  ### Parameters
  `address`: The address of the smart contract. 

  ### Returns
  `result`: The compiled bytecode in hexadecimal format.

  ## Examples

  ### Request
  ```bash
  curl https://<....> \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_getCode","params": ["0x507877C2E26f1387432D067D2DaAfa7d0420d90a"],"id":1}'
  ```

  ### Response
  ```json
    {
        "jsonrpc":"2.0",
        "id":1,
        "result":"0x0"
    }
  ```
  
</details>

<details>
  <summary><b>eth_getBlockByNumber</b></summary>
  Returns information of the block matching the given block number.

  ### Parameters
  `number`: The block number in hexadecimal format or the string "latest".

  ### Returns
  `result`: A block object, or null when no block was found. The block has the following structure:
> `nodeUrl`: String 
> > The URL of the node

> `difficulty`: Number 
> > The integer of the difficulty for this block encoded as a hexadecimal

> `extraData`: String
> > The “extra data” field of this block

> `gasLimit`: Number
> > The maximum gas allowed in this block encoded as a hexadecimal

> `gasUsed`: Number 
> > The total used gas by all transactions in this block encoded as a hexadecimal

> `hash`: String 
> > The block hash of the requested block. null if pending

> `logsBloom`: String
> > The bloom filter for the logs of the block. null if pending

> `miner`: String
> > The address of the beneficiary to whom the mining rewards were given

> `mixHash`: String 
> > A string of a 256-bit hash encoded as a hexadecimal

> `nonce`: Number
> > The hash of the generated proof-of-work. null if pending

> `number`: Number
> > The block number of the requested block encoded as hexadecimal. null if pending

> `parentHash`: String 
> > The hash of the parent block

> `receiptsRoot`: String
> > The root of the receipts trie of the block

> `sha3Uncles`: String
> > The SHA3 of the uncles data in the block

> `size`: Number
> > The size of this block in bytes as an Integer value encoded as hexadecimal

> `stateRoot`: String
> > The root of the final state trie of the block

> `timestamp`: String
> > The UNIX timestamp for when the block was collated

> `totalDifficulty`: Number
> > The integer of the total difficulty of the chain until this block encoded as a hexadecimal

> `transactions`: String[]
> > An array of transaction objects

> `transactionsRoot`: String
> > The root of the transaction trie of the block

> `uncles`: String[]
> > An array of uncle hashes


  ## Examples

  ### Request
  ```bash
  curl https://<....> \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_getBlockByNumber","params": ["0x27"],"id":1}'
  ```

  ### Response
  ```json
    {
        "jsonrpc":"2.0",
        "id":1,
        "result":{
          "nodeUrl": "http://....",
          "difficulty": "0x4ea3f27bc",
          "extraData": "0x476574682f4c5649562f76312e302e302f6c696e75782f676f312e342e32",
          "gasLimit": "0x4a817c800",
          "gasUsed": "0x0",
          "hash": "0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae",
          "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
          "miner": "0xbb7b8287f3f0a933474a79eae42cbca977791171",
          "mixHash": "0x4fffe9ae21f1c9e15207b1f472d5bbdd68c9595d461666602f2be20daf5e7843",
          "nonce": "0x689056015818adbe",
          "number": "blockNumber",
          "parentHash": "0xe99e022112df268087ea7eafaf4790497fd21dbeeb6bd7a1721df161a6657a54",
          "receiptsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
          "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
          "size": "0x220",
          "stateRoot": "0xddc8b0234c2e0cad087c8b389aa7ef01f7d79b2570bccb77ce48648aa61c904d",
          "timestamp": "1699627276",
          "totalDifficulty": "0x78ed983323d",
          "transactions": [],
          "transactionsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
          "uncles": [],
        }
    }
  ```
  
</details>

<details>
  <summary><b>eth_getBlockByHash</b></summary>
  Returns information of the block matching the given block hash.

  ### Parameters
  `hash`: The hash of the block.

  ### Returns
  `result`: A block object, or null when no block was found. The block has the following structure:
> `nodeUrl`: String 
> > The URL of the node

> `difficulty`: Number 
> > The integer of the difficulty for this block encoded as a hexadecimal

> `extraData`: String
> > The “extra data” field of this block

> `gasLimit`: Number
> > The maximum gas allowed in this block encoded as a hexadecimal

> `gasUsed`: Number 
> > The total used gas by all transactions in this block encoded as a hexadecimal

> `hash`: String 
> > The block hash of the requested block. null if pending

> `logsBloom`: String
> > The bloom filter for the logs of the block. null if pending

> `miner`: String
> > The address of the beneficiary to whom the mining rewards were given

> `mixHash`: String 
> > A string of a 256-bit hash encoded as a hexadecimal

> `nonce`: Number
> > The hash of the generated proof-of-work. null if pending

> `number`: Number
> > The block number of the requested block encoded as hexadecimal. null if pending

> `parentHash`: String 
> > The hash of the parent block

> `receiptsRoot`: String
> > The root of the receipts trie of the block

> `sha3Uncles`: String
> > The SHA3 of the uncles data in the block

> `size`: Number
> > The size of this block in bytes as an Integer value encoded as hexadecimal

> `stateRoot`: String
> > The root of the final state trie of the block

> `timestamp`: String
> > The UNIX timestamp for when the block was collated

> `totalDifficulty`: Number
> > The integer of the total difficulty of the chain until this block encoded as a hexadecimal

> `transactions`: String[]
> > An array of transaction objects

> `transactionsRoot`: String
> > The root of the transaction trie of the block

> `uncles`: String[]
> > An array of uncle hashes


  ## Examples

  ### Request
  ```bash
  curl https://<....> \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_getBlockByHash","params": ["dab0b27795fa2aaaf75ee2cbd28e218ad6f87a1fbf908ecccd2d96c335c34f07"],"id":1}'
  ```

  ### Response
  ```json
    {
        "jsonrpc":"2.0",
        "id":1,
        "result":{
          "nodeUrl": "http://....",
          "difficulty": "0x4ea3f27bc",
          "extraData": "0x476574682f4c5649562f76312e302e302f6c696e75782f676f312e342e32",
          "gasLimit": "0x4a817c800",
          "gasUsed": "0x0",
          "hash": "0xdc0818cf78f21a8e70579cb46a43643f78291264dda342ae31049421c82d21ae",
          "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
          "miner": "0xbb7b8287f3f0a933474a79eae42cbca977791171",
          "mixHash": "0x4fffe9ae21f1c9e15207b1f472d5bbdd68c9595d461666602f2be20daf5e7843",
          "nonce": "0x689056015818adbe",
          "number": "blockNumber",
          "parentHash": "0xe99e022112df268087ea7eafaf4790497fd21dbeeb6bd7a1721df161a6657a54",
          "receiptsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
          "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
          "size": "0x220",
          "stateRoot": "0xddc8b0234c2e0cad087c8b389aa7ef01f7d79b2570bccb77ce48648aa61c904d",
          "timestamp": "1699627276",
          "totalDifficulty": "0x78ed983323d",
          "transactions": [],
          "transactionsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
          "uncles": [],
        }
    }
  ```
  
</details>

<details>
  <summary><b>eth_sendRawTransaction</b></summary>
  Submits a pre-signed transaction for broadcast to the network.

  ### Parameters
  `transaction`: The transaction call object. Contains the following fields: 

  > `from`: string
  > > The address from which the transaction is sent 

  > `to`: string 
  > > The address to which the transaction is addressed

  > `gas`: integer 
  > > The integer of gas provided for the transaction execution 

  > `gasPrice`: integer
  > > The integer of gasPrice used for each paid gas encoded as hexadecimal

  > `value`: integer
  > > The integer of value sent with this transaction encoded as hexadecimal 

  > `data`: string
  > > The hash of the method signature and encoded parameters. 

  ### Returns
  `result`: The transaction hash, or the zero hash if the transaction is not yet available.

  ## Examples

  ### Request
  ```bash
  curl https://<....> \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_sendRawTransaction","params": ["[Transaction Object]"],"id":1}'
  ```

  ### Response
  ```json
    {
        "jsonrpc":"2.0",
        "id":1,
        "result":"0x...."
    }
  ```
  
</details>

<details>
  <summary><b>eth_sendInternalTransaction</b></summary>
  Submits an internal, off-chain transaction to the network.

  ### Parameters
  `transaction`: The transaction call object. Contains the following fields: 

  > `from`: string
  > > The address from which the transaction is sent 

  > `to`: string 
  > > The address to which the transaction is addressed

  > `gas`: integer 
  > > The integer of gas provided for the transaction execution 

  > `gasPrice`: integer
  > > The integer of gasPrice used for each paid gas encoded as hexadecimal

  > `value`: integer
  > > The integer of value sent with this transaction encoded as hexadecimal 

  > `data`: string
  > > The hash of the method signature and encoded parameters. 

  ### Returns
  `result`: The transaction hash, or the zero hash if the transaction is not yet available.

  ## Examples

  ### Request
  ```bash
  curl https://<....> \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_sendInternalTransaction","params": ["[Internal Transaction Object]"],"id":1}'
  ```

  ### Response
  ```json
    {
        "jsonrpc":"2.0",
        "id":1,
        "result":"0x...."
    }
  ```
  
</details>

<details>
  <summary><b>eth_getTransactionByHash</b></summary>
  Returns the information about a transaction from a transaction hash.

  ### Parameters
  `hash`: The hash of a transaction

  ### Returns
  `result`: The transaction response object, or null if no transaction is found. The object has the following structure:

  > `blockHash`: String
  > > The hash of the block where this transaction was in. Null when it's a pending log 

  > `blockNumber`: String
  > > The block number where this transaction was in. Null when it's a pending log 

  > `from`: String
  > > The address of the sender 

  > `gas`: Number
  > > The gas provided by the sender, encoded as hexadecimal 

  > `gasPrice`: Number
  > > The gas price provided by the sender  encoded as hexadecimal 

  > `hash`: String
  > > The transaction hash

  > `input`: String
  > > The data sent along with the transaction.

  > `nonce`: String
  > > The number of transactions made by the sender prior to this one encoded as hexadecimal 

  > `to`: String
  > > The address of the receiver. Null when its a contract creation transaction 

  > `transactionIndex`: String
  > > The integer of the transaction's index position that the log was created from. Null when it's a pending log 

  > `value`: Number
  > > The value transferred encoded as hexadecimal 

  > `type`: String
  > >The transaction type 

  > `accessList`: String[] 
  > > A list of addresses and storage keys that the transaction plans to access 

  > `chainId`: String 
  > > The chain id of the transaction, if any 

  > `v`: String 
  > > The standardized V field of the signature 

  > `r`: String
  > > The R field of the signature 

  > `s`: String
  > > The S field of the signature

  ## Examples

  ### Request
  ```bash
  curl https://<....> \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_getTransactionByHash","params": ["dab0b27795fa2aaaf75ee2cbd28e218ad6f87a1fbf908ecccd2d96c335c34f07"],"id":1}'
  ```

  ### Response
  ```json
    {
        "jsonrpc":"2.0",
        "id":1,
        "result":{
          "blockHash": "0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2",
          "blockNumber": "0x5daf3b",
          "from": "0xa7d9ddbe1f17865597fbd27ec712455208b6b76d",
          "gas": "0xc350",
          "gasPrice": "0x4a817c800",
          "hash": "0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b",
          "input": "0x68656c6c6f21",
          "nonce": "0x15",
          "to": "0xf02c1c8e6114b1dbe8937a39260b5b0a374432bb",
          "transactionIndex": "0x1",
          "value": "0xf3dbb76162000",
          "v": "0x25",
          "r": "0x1b5e176d927f8e9ab405058b2d2457392da3e20f328b16ddabcebc33eaac5fea",
          "s": "0x4ba69724e8f69de52f0125ad8b3c5c2cef33019bac3249e2c0a2192766d1721c",
      }
    }
  ```
  
</details>


</details>

<details>
  <summary><b>eth_getTransactionReceipt</b></summary>
  Returns the receipt of a transaction by transaction hash.

  ### Parameters
  `hash`: The hash of a transaction

  ### Returns
  result: The transaction response object, or null if no transaction is found. The object has the following structure:

  > `blockHash`: String 
  > > The hash of the block where this transaction was in 

  > `blockNumber`: Number
  > > The block number where this transaction was added encoded as a hexadecimal 

  > `contractAddress`: String
  > > The contract address created for contract creation, otherwise null 

  > `cumulativeGasUsed`: String
  > > The total gas used when this transaction was executed in the block 

  > `effectiveGasPrice`: String
  > > The total base charge plus tip paid for each unit of gas 

  > `from`: String
  > > The address of the sender 

  > `gasUsed`: String
  > > The amount of gas used by this specific transaction alone 

  > `logs`: An array of log objects that generated this transaction:
  >
  > > `address`: String 
  > > > The address from which this log was generated 
  >
  > > `topics`: String[] 
  > > > An array of zero to four 32 Bytes DATA of indexed log arguments. In Solidity, the first topic is the hash of the signature of the event (e.g. Deposit(address, bytes32, uint256)), except you declare the event with the anonymous specifier 
  >
  > > `data`: Bytes 
  > > > The 32 byte non-indexed argument of the log 
  >
  > > `blockNumber`: Number
  > > > The block number where this log was in 
  >
  > > `transactionHash`: String
  > > > The hash of the transaction from which this log was created from. null if the log is pending
  >
  > > `transactionIndex`: Number 
  > > > The transactions index position from which this log was created from. null if the log is pending 
  >
  > > `blockHash`: String
  > > > The hash of the block where this log was in 
  >
  > > `logIndex`: Number
  > > > The integer of log index position in the block encoded as hexadecimal. null if the log is pending 
  >
  > > `removed`: Boolean 
  > > > It is true if log was removed, due to a chain reorganization and false if it's a valid log 
  
  > `logsBloom`: Boolean 
  > > The bloom filter which is used to retrieve related logs status It is either 1 (success) or 0 (failure) encoded as a hexadecimal 

  > `to`: String 
  > > The address of the receiver. Null when its a contract creation transaction 

  > `transactionHash`: String 
  > > The hash of the transaction 

  > `transactionIndex`: Number
  > > The transactions index position in the block encoded as a hexadecimal 

  > `type`: String 
  > > The type of value

  ## Examples

  ### Request
  ```bash
  curl https://<....> \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_getTransactionReceipt","params": ["dab0b27795fa2aaaf75ee2cbd28e218ad6f87a1fbf908ecccd2d96c335c34f07"],"id":1}'
  ```

  ### Response
  ```json
    {
        "jsonrpc":"2.0",
        "id":1,
        "result":{
          "blockHash": "0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2",
          "blockNumber": "0x5daf3b",
          "from": "0xa7d9ddbe1f17865597fbd27ec712455208b6b76d",
          "gas": "0xc350",
          "gasPrice": "0x4a817c800",
          "hash": "0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b",
          "input": "0x68656c6c6f21",
          "nonce": "0x15",
          "to": "0xf02c1c8e6114b1dbe8937a39260b5b0a374432bb",
          "transactionIndex": "0x1",
          "value": "0xf3dbb76162000",
          "v": "0x25",
          "r": "0x1b5e176d927f8e9ab405058b2d2457392da3e20f328b16ddabcebc33eaac5fea",
          "s": "0x4ba69724e8f69de52f0125ad8b3c5c2cef33019bac3249e2c0a2192766d1721c",
      }
    }
  ```
  
</details>


<details>
  <summary><b>eth_call</b></summary>
  Executes a new message call immediately without creating a transaction on the blockchain.

  ### Parameters
  `transaction`: The transaction call object. Contains the following fields: 

  > `from`: string
  > > The address from which the transaction is sent 

  > `to`: string 
  > > The address to which the transaction is addressed

  > `gas`: integer 
  > > The integer of gas provided for the transaction execution 

  > `gasPrice`: integer
  > > The integer of gasPrice used for each paid gas encoded as hexadecimal

  > `value`: integer
  > > The integer of value sent with this transaction encoded as hexadecimal 

  > `data`: string
  > > The hash of the method signature and encoded parameters. 

  ### Returns
  `result`: The returned value of the executed contract.

  ## Examples

  ### Request
  ```bash
  curl https://<....> \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_call","params": ["{\
  "from": "0xb60e8dd61c5d32be8058bb8eb970870f07233155",\
  "to": "0xd46e8dd67c5d32be8058bb8eb970870f07244567",\
  "gas": "0x76c0",\
  "gasPrice": "0x9184e72a000",\
  "value": "0x9184e72a",\
  "data": "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675"\
  }"],"id":1}'
  ```

  ### Response
  ```json
    {
        "jsonrpc":"2.0",
        "id":1,
        "result":"0x...."
    }
  ```
  
</details>


<details>
  <summary><b>eth_getAccessList</b></summary>
  Fetches a transaction access list. An Access List is a list of addresses and storage keys that the transaction plans to access, lowering the gas cost of the transaction.

  ### Parameters
  `transaction`: The transaction call object. Contains the following fields: 

  > `from`: string
  > > The address from which the transaction is sent 

  > `to`: string 
  > > The address to which the transaction is addressed

  > `gas`: integer 
  > > The integer of gas provided for the transaction execution 

  > `gasPrice`: integer
  > > The integer of gasPrice used for each paid gas encoded as hexadecimal

  > `value`: integer
  > > The integer of value sent with this transaction encoded as hexadecimal 

  > `data`: string
  > > The hash of the method signature and encoded parameters. 

  ### Returns
  `result`: Access list object with the following fields:
  
  > `accessList`: A list of objects with the following fields:
  > > `address`: String
  > > > Addresses to be accessed by the transaction.
  >
  > > `storageKeys`: String[]
  > > > Storage keys to be accessed by the transaction.

  > `gasUsed`: Number
  > > A hexadecimal string representing the approximate gas cost for the transaction if the access list is included.

  ## Examples

  ### Request
  ```bash
  curl https://<....> \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_getAccessList","params": ["{\
  "from": "0xb60e8dd61c5d32be8058bb8eb970870f07233155",\
  "to": "0xd46e8dd67c5d32be8058bb8eb970870f07244567",\
  "gas": "0x76c0",\
  "gasPrice": "0x9184e72a000",\
  "value": "0x9184e72a",\
  "data": "0xd46e8dd67c5d32be8d46e8dd67c5d32be8058bb8eb970870f072445675058bb8eb970870f072445675"\
  }"],"id":1}'
  ```

  ### Response
  ```json
    {
        "jsonrpc":"2.0",
        "id":1,
        "result":{
        "accessList": [{
          "address": "0xa02457e5dfd32bda5fc7e1f1b008aa5979568150",
          "storageKeys": ["0x0000000000000000000000000000000000000000000000000000000000000081"]
        }],
        "gasUsed": "0x125f8"
      }
    }
  ```
  
</details>
