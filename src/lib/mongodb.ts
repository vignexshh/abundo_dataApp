import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your MONGODB_URI env variable');
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri!, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri!, options);
  clientPromise = client.connect();
}

export default clientPromise;

// Add this to global type definitions (e.g., global.d.ts)
declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}