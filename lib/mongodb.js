import { MongoClient } from "mongodb";

if (!process.env.MONGO_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

const client = new MongoClient(process.env.MONGO_URI);
const clientPromise = client.connect();

export default clientPromise;
