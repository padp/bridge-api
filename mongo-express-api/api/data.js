import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
const dbName = "press_db";

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;

  const client = new MongoClient(uri);
  await client.connect();

  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return db;
}

export default async function handler(req, res) {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("press_data");

    const data = await collection.find({}, { projection: { _id: 0 } }).toArray();

    res.status(200).json(data);
  } catch (error) {
    console.error("Mongo error:", error);
    res.status(500).json({ error: "Database error" });
  }
}