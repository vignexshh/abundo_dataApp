import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dbName = searchParams.get("db");
    const collectionName = searchParams.get("collection");

    if (!dbName || !collectionName) {
      return NextResponse.json({ error: "Database and collection names are required" }, { status: 400 });
    }

    const mongoose = await connectToDatabase();

    // Ensure the connection has a valid db property
    const connectionDb = mongoose.connection.db;
    if (!connectionDb) {
      return NextResponse.json({ error: "Database connection is undefined" }, { status: 500 });
    }
    const db = connectionDb;
    if (!db) {
      return NextResponse.json({ error: "Database not found" }, { status: 404 });
    }

    const collection = db.collection(collectionName);
    const data = await collection.find({}).toArray();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
