// lib/mongodb.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
    throw new Error("❌ Missing MONGODB_URI in .env.local");
}

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
    // Prevent multiple connections during hot reload
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, {});
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    // New client in production
    client = new MongoClient(uri, {});
    clientPromise = client.connect();
}

export default clientPromise;
