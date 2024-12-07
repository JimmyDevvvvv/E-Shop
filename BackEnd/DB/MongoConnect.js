const mongoose = require('mongoose');

class MongoConnect {
    static #instance = null;

    constructor() {
        if (MongoConnect.#instance) {
            throw new Error("You cannot create multiple instances of MongoConnect. Use MongoConnect.getInstance() instead.");
        }
        MongoConnect.#instance = this;
    }

    static getInstance() {
        if (!MongoConnect.#instance) {
            MongoConnect.#instance = new MongoConnect();
        }
        return MongoConnect.#instance;
    }

    async connect(url) {
        if (this.connection) {
            console.log("Using existing MongoDB connection");
            return this.connection;
        }

        try {
            this.connection = await mongoose.connect(url, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log("Connected to the database");
            return this.connection;
        } catch (error) {
            console.error("Error connecting to the database:", error.message);
            throw error;
        }
    }
}

module.exports = MongoConnect;
