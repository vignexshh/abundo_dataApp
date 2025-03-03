// app/api/collections/route.ts
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dbName = searchParams.get("db");

  if (!dbName) {
    return NextResponse.json({ error: "Database name is required" }, { status: 400 });
  }

  try {
    await client.connect();
    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();
    return NextResponse.json({ collections: collections.map((coll) => coll.name) });
  } catch (error) {
    console.error("Error fetching collections:", error); // Log the full error
    return NextResponse.json(
      { error: `Failed to fetch collections from ${dbName}` },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}