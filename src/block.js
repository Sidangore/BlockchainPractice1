// class for the block

const { SHA256 } = require("crypto-js");
const hex2ascii = require('hex2ascii');

// Block Model
class Block {
    constructor(data) {
        this.time = 0;
        this.height = 0;
        this.body = Buffer.from(JSON.stringify(data)).toString('hex');
        this.hash = null;
        this.previousBlockHash = null;
    }

    // Validate the block
    validateBlock() {
        let self = this;
        return new Promise(async(resolve, reject) => {
            const hash = self.hash;
            self.hash = null;
            const calculatedHash = await SHA256(JSON.stringify(self)).toString();
            self.hash = hash;
            if (calculatedHash !== hash) {
                //hash has been tampered
                resolve(false);
            } else {
                resolve(true);
            }
        });
    }

    // Get the block data
    getBlockData() {
        const encodedData = this.body;
        const decodedData = JSON.parse(hex2ascii(encodedData));
        return decodedData && this.height > 0 ? decodedData : "No Data - Genesis Block";
    }
}

module.exports.Block = Block;