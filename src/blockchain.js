// Blockchain

const bitcoinMessage = require('bitcoinjs-message');
const { SHA256 } = require('crypto-js');

const { Block } = require('./block');

// Models for Blockchain
class Blockchain {
    constructor() {
        this.chain = [];
        this.height = -1;
        this.initializeChain();
    }

    // Initialize the blockchain 
    initializeChain() {
        if (this.height === -1) {
            const block = new Block({ data: "Genesis Block" });
            this._addBlock(block);
        }
    }

    // Add the block to the chain
    _addBlock(block) {
        let self = this;
        return new Promise(async(resolve, reject) => {
            block.height = self.chain.length;
            block.time = new Date().getTime().toString().slice(0, -3);
            if (self.chain.length > 0) {
                block.previousBlockHash = self.chain[self.chain.length - 1].hash;
            }
            block.hash = SHA256(JSON.stringify(block)).toString();
            self.chain.push(block);
            self.height++;
            self.validateChain();
            resolve(block);
            reject("Block cannot be added in Blockchain.");
        });
    }

    // Get the chain height
    getChainHeight() {
        return new Promise((resolve, reject) => {
            resolve(this.height);
        });
    }

    // Request the ownership of the wallet -> will allow to request a message that you will use to sign it with your Elctrun or Bitcoin core wallet
    requestMessageOwnershipVerification(address) {
        return new Promise((resolve) => {
            const message = `${address}:${new Date().getTime().toString().slice(0, -3)}:starRegistry`;
            resolve(message);
        });
    }

    // Submit star discovery
    submitStar(address, messsage, signature, star) {
        let self = this;

        return new Promise(async(resolve, reject) => {
            // get the message time
            const messageTime = parseInt(messsage.split(':')[1]);
            // get the current time to verification purpose
            const currentTime = parseInt(new Date().getTime().toString().slice(0, -3));
            if (currentTime < messageTime + (5 * 60)) {
                // Within the verification time
                const isValid = bitcoinMessage.verify(messsage, address, signature);
                if (isValid) {
                    const block = new Block({ "owner": address, "star": star });
                    const addedBlock = await self._addBlock(block);
                    self.validateChain();
                    resolve(addedBlock);

                } else {
                    reject("Signature not valid!");
                }
            } else {
                reject("Time limit of 5 mins expired!");
            }
        });
    }

    // Get block by hash
    getBlockByHeight(height) {
        const self = this;
        return new Promise((resolve, reject) => {
            const block = self.chain.filter(block => block.height === height)[0];
            if (block) {
                resolve(block);
            } else {
                reject(null);
            }
        });
    }

    // Get block by hash
    getBlockByHash(hash) {
        const self = this;
        return new Promise((resolve, reject) => {
            const block = self.chain.filter(block => block.hash === hash)[0];
            if (block) {
                resolve(block);
            } else {
                reject(null)
            }
        });
    }

    // Get stars from wallet address
    getStarsByWalletAddress(address) {
        let self = this;
        const stars = [];
        return new Promise((resolve, reject) => {
            self.chain.forEach((block) => {
                const data = block.getBlockData();
                if (data) {
                    if (data.owner === address) {
                        stars.push(data);
                    }
                }
            });
            resolve(stars);
        });
    }

    // Validate Chain
    validateChain() {
        let self = this;
        let errorLog = [];
        return new Promise(async(resolve, reject) => {
            const promises = [];
            let chainIndex = 0;
            self.chain.forEach((block) => {
                promises.push(block.validateBlock());
                if (block.height > 0) {
                    const previousBlockHash = block.previousBlockHash;
                    const hash = self.chain[chainIndex - 1].hash;
                    if (hash != previousBlockHash) {
                        errorLog.push(`Error : Block Height: ${block.height} - Previous hash doesnt match`);
                    }
                }
                chainIndex++;
            });
            Promise.all(promises).then((result) => {
                chainIndex = 0;
                result.forEach(valid => {
                    if (!valid) {
                        errorLog.push(`Error : Block Height - ${self.chain[chainIndex].height} - has been tampered.`);
                    }
                    chainIndex++;
                });
                resolve(errorLog);
            }).catch(err => {
                console.log(err);
                reject(err);
            })
        });
    }
}

module.exports.Blockchain = Blockchain;