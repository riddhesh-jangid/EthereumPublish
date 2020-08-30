:construction: <sub>Mar - Apr 2020</suv>
# Ethereum Publish :gem:
Ethereum Publish is a DApp for writers to publish their work :books: on ethereum public blockchain. Ethereum publish can protect author's works from theft and also save intermediate money which are taken by publishers. [:camera: [Screenshots](https://github.com/snakode/EthereumPublish/blob/master/README.md#screenshots)]

## Dependencies
`Node.js (v12.16.1)`
`NPM(v6.14.2)`
`Solidity(v0.5.16)`
`Metamask(v7.7.8)`
`Truffle(v5.1.21)`
`React`
`Ganache(v2.1.2)`
`IPFS`

## Setup & Configuration

> **Ganache**
> - Start ganache
> - Create new workspace so that you can use it again when needed 

> **IPFS**
> - Start IPFS
> - Set HTTPHeaders at starting as shown in [Figure](https://raw.githubusercontent.com/snakode/EthereumPublish/master/screenshots/Coniguration%20for%20cors-header.png)

> **Metamask**
> - Create account 
> - Create a custom RPC with url http://localhost:7545/ so that we can connect on local blockchain of ganache 
> - Select custom RPC 
> - Import accounts by taking private key from ganache 
> - Select one of account which have ether as shown in [Figure](https://raw.githubusercontent.com/snakode/EthereumPublish/master/screenshots/Selection%20of%20account.png)

> **Setting up smart contract on our ganache network**
> - Open terminal 
> - Go insided ethereumPublish 
> - Run: truffle compile 
> - Run: truffle migrate –reset 

> **Setting up node_modules inside client folder**
> - Go inside ethereumPublish/client from terminal 
> - Run: npm install  
> - Run: npm start 

> **Run Ethereum publish**
> - After server begins at localhost:3000 metamask ask for permission to get connected with ganache 
> - Give permission to metamask 
> - Reload page and start using 

> **Expected errors**
> - After swiching account on metamask reload page so that Ethereum publish can update address 
> - Sometimes it takes time to render information at home page so clicking at any button at that time can bring error
> - At present enter ether in positive integer as there is a issue with current version of web3 
> - Whenever you create account with same name which is used previously then metamask gives you a very high transaction fees because of modifiers used at solidity. So use different names everytime you register author and same as for reader 
> - There are two transaction at the time of buying book so confirms both transaction.  If you alter url directly then it gives you a error page 
> - If you reload a page then also it gives you error page. 

## Screenshots
| Name | Image |
|---|---|
|Books for buy|[Show](https://raw.githubusercontent.com/snakode/EthereumPublish/master/screenshots/Booka%20for%20buy.png)|
|Books for read|[Show](https://raw.githubusercontent.com/snakode/EthereumPublish/master/screenshots/Books%20for%20read.png)|
|Configuration for cors-header|[Show](https://raw.githubusercontent.com/snakode/EthereumPublish/master/screenshots/Coniguration%20for%20cors-header.png)|
|Ganache|[Show](https://raw.githubusercontent.com/snakode/EthereumPublish/master/screenshots/Ganache.png)|
|Homepage|[Show](https://raw.githubusercontent.com/snakode/EthereumPublish/master/screenshots/Homepage.png)|
|IPFS|[Show](https://raw.githubusercontent.com/snakode/EthereumPublish/master/screenshots/IPFS.png)|
|Metamask accounts|[Show](https://raw.githubusercontent.com/snakode/EthereumPublish/master/screenshots/Metamask%20Accounts.png)|
|Payment confirmation|[Show](https://raw.githubusercontent.com/snakode/EthereumPublish/master/screenshots/Payment%20confirmation.png)|
|Register book|[Show](https://raw.githubusercontent.com/snakode/EthereumPublish/master/screenshots/Register%20Book.png)|
|Selection of account|[Show](https://raw.githubusercontent.com/snakode/EthereumPublish/master/screenshots/Selection%20of%20account.png)|
|Books|[Show](https://raw.githubusercontent.com/snakode/EthereumPublish/master/screenshots/book.png)|












