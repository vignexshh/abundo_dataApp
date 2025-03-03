// app/api/data/route.ts
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dbName = searchParams.get("db");
  const collectionName = searchParams.get("collection");

  if (!dbName || !collectionName) {
    return NextResponse.json(
      { error: "Database and collection names are required" },
      { status: 400 }
    );
  }

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const data = await collection.find({}).toArray();

    console.log("Fetched data:", data); // Debugging: Log fetched data
    console.log("Database:", dbName); // Debugging: log database name
    console.log("collection:", collectionName); //debugging: log collection name
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  } finally {
    await client.close();
  }
}