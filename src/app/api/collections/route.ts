import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dbName = searchParams.get("db");

    if (!dbName) {
      return NextResponse.json({ error: "Database name is required" }, { status: 400 });
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

    const collections = await db.listCollections().toArray();
    return NextResponse.json({ collections: collections.map((coll: any) => coll.name) });
  } catch (error) {
    console.error("Error fetching collections:", error);
    return NextResponse.json({ error: "Failed to fetch collections" }, { status: 500 });
  }
}