// lib/mongodb.ts
import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://shiro:mamam@alphamh.4tgem.mongodb.net/?retryWrites=true&w=majority&appName=AlphaMH"

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// Define a type for the cached connection
type CachedConnection = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

let cachedConnection: CachedConnection = { conn: null, promise: null };

export const connectToDatabase = async (): Promise<typeof mongoose> => {
  if (cachedConnection.conn) {
    console.log("Using cached MongoDB connection");
    return cachedConnection.conn;
  }

  if (!cachedConnection.promise) {
    console.log("Establishing new MongoDB connection");
    cachedConnection.promise = mongoose
      .connect(MONGODB_URI)
      .then((mongoose) => {
        console.log("Connected to MongoDB");
        return mongoose;
      })
      .catch((error) => {
        console.error("MongoDB connection error:", error);
        throw error; // Rethrow the error to prevent further execution
      });
  }

  try {
    cachedConnection.conn = await cachedConnection.promise;
    return cachedConnection.conn;
  } catch (error) {
    console.error("Failed to establish MongoDB connection:", error);
    throw error;
  }
};