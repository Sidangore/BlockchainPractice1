// Blockchain Controller- Enpoints and sample code


class BlockchainController {
    constructor(app, blockchainObject) {
        this.app = app;
        this.blockchain = blockchainObject;

        // Endpoints
        this.getBlockByHeight();
        this.requestOwnership();
        this.submitStar();
        this.getBlockByHash();
        this.getStarsByOwner();
    }

    getBlockByHeight() {
        this.app.get("/block/height/:height", async(req, res) => {
            if (req.params.height) {
                const height = parseInt(req.params.height);
                try {
                    const block = await this.blockchain.getBlockByHeight(height);
                    if (block == null) {
                        return res.status(404).send("Block not found!");
                    } else {
                        return res.status(200).json(block);
                    }
                } catch (error) {
                    return res.status(500).send("Error in finding the block")
                }
            } else {
                return res.status(404).send("Block not found -> Check the parameters");
            }
        });
    }

    requestOwnership() {
        this.app.post("/requestValidation", async(req, res) => {
            if (req.body.address) {
                const address = req.body.address;
                const message = await this.blockchain.requestMessageOwnershipVerification(address);
                if (message) {
                    return res.status(200).json(message);
                } else {
                    return res.status(500).send("Error happened");
                }
            } else {
                return res.status(500).send("check the parameters");
            }
        });
    }

    submitStar() {
        this.app.post("/submitstar", async(req, res) => {
            if (req.body.address && req.body.message && req.body.signature && req.body.star) {
                const address = req.body.address;
                const message = req.body.message;
                const signature = req.body.signature;
                const star = req.body.star;
                // console.log(address, message, signature, star);
                try {
                    let block = await this.blockchain.submitStar(address, message, signature, star);

                    if (block) {
                        return res.status(200).json(block);
                    } else {
                        return res.status(500).send("Error happened here");
                    }
                } catch (error) {
                    return res.status(500).send("yaha error hai");
                }
            } else {
                return res.status(500).send("check the parameters");
            }
        });
    }

    getBlockByHash() {
        this.app.get("/block/hash/:hash", async(req, res) => {
            if (req.params.hash) {
                const hash = req.params.hash;
                const block = await this.blockchain.getBlockByHash(hash);
                if (block) {
                    return res.status(200).json(block);
                } else {
                    return res.status(404).send("Block not found");
                }
            } else {
                return res.status(404).send("Block not found! Check the parameters");
            }
        });
    }

    getStarsByOwner() {
        this.app.get("/blocks/:address", async(req, res) => {
            if (req.params.address) {
                const address = req.params.address;
                try {
                    const stars = await this.blockchain.getStarsByWalletAddress(address);
                    if (stars) {
                        return res.status(200).json(stars);
                    } else {
                        return res.status(404).send("Stars not found");
                    }
                } catch (error) {
                    return res.status(500).send("Error happened");
                }
            } else {
                return res.status(500).send("stars not found! please check the parameters");
            }
        });
    }
}

module.exports = (app, blockchainObject) => {
    return new BlockchainController(app, blockchainObject);
}