require('dotenv').config();
import * as express from 'express';
import { MongoClient } from 'mongodb';
import * as os from 'node:os';

const app = express();

const BaseClient = new MongoClient(process.env.MONGODB_CONNECTION_STRING);

console.log("Connecting to MongoDB...");
const mongoClient = await BaseClient.connect();
console.log("Connected to MongoDB.");

console.log("Intializing Express...");

app.get("/health", async (req, res) => {
    try {
        const memoryUsage = os.freemem() / os.totalmem() * 100;
        res.status(200).send({
            memStatus: memoryUsage < 80 ? "HEALTHY" : memoryUsage < 90 ? "HIGH" : "CRITICAL",
            memUsage: memoryUsage
        });
    } catch (exception) {
        res.sendStatus(500);
        console.error(exception);
    }
});

app.listen(process.env.PORT || 3000);

console.timeLog(`UP : ${process.env.PORT || 3000}`);