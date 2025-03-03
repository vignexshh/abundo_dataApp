import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri);

export async function GET() {
  try {
    await client.connect();
    const adminDb = client.db().admin();
    const databases = await adminDb.listDatabases();
    return NextResponse.json({ databases: databases.databases.map((db) => db.name) });
  } catch (error) {
    console.error("Error fetching databases:", error);
    return NextResponse.json({ error: "Failed to fetch databases" }, { status: 500 });
  } finally {
    await client.close();
  }
}