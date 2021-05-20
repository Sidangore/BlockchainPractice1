const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const { Blockchain } = require('./src/blockchain');

class ApplicationServer {
    constructor() {
        // Express application Object
        this.app = express();
        // Blockchain Class Object
        this.blockchain = new Blockchain();
        // Method : Initiate the Express framework
        this.initExpress();
        // Method : Initiate the Express middlewares
        this.initExpressMiddleware();
        // Method to initiate controllers
        this.initControllers();
        // Run the express application
        this.start();
    }

    initExpress() {
        this.app.set("port", 8000);
    }

    initExpressMiddleware() {
        this.app.use(morgan("dev"));
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
    }

    initControllers() {
        require("./blockchainController.js")(this.app, this.blockchain);
    }

    start() {
        let self = this;
        this.app.listen(this.app.get("port"), () => {
            console.log(`Server Listening at port: ${self.app.get("port")}`);
        });
    }
}

new ApplicationServer();