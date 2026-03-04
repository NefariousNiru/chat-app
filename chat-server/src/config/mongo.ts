// file: src/config/mongo.ts

import { MongoClient, type Db } from "mongodb";
import { env } from "./env.js";

let client: MongoClient | null = null;
let db: Db | null = null;

/**
 * Establishes a singleton MongoDB connection for the process.
 * Repeated calls are safe and return the already-connected client/db.
 */
export async function connectMongo(): Promise<{ client: MongoClient; db: Db }> {
  if (client && db) return { client, db };

  client = new MongoClient(env.MONGO_URI, {
    // Keep defaults; driver manages pooling internally.
  });

  await client.connect();
  db = client.db(env.MONGO_DB);

  return { client, db };
}

/**
 * Returns the connected MongoDB Db handle, connecting on demand if needed.
 */
export async function getMongoDb(): Promise<Db> {
  const { db: connectedDb } = await connectMongo();
  return connectedDb;
}

/**
 * Executes a lightweight ping command against MongoDB.
 * Throws if the server is unreachable or credentials are invalid.
 */
export async function pingMongo(): Promise<void> {
  const database = await getMongoDb();
  await database.command({ ping: 1 });
}

/**
 * Closes the MongoDB client and clears module-level singletons.
 * Safe to call multiple times.
 */
export async function closeMongo(): Promise<void> {
  if (!client) return;

  await client.close();
  client = null;
  db = null;
}
