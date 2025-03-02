import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const mongoose = await connectToDatabase();

    // Ensure the connection has a valid db property
    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
    }
    const adminDb = db.admin();
    if (!adminDb) {
      return NextResponse.json({ error: "Database admin access failed" }, { status: 500 });
    }

    const dbList = await adminDb.listDatabases();
    return NextResponse.json({ databases: dbList.databases.map((db: any) => db.name) });
  } catch (error) {
    console.error("Error fetching databases:", error);
    return NextResponse.json({ error: "Failed to fetch databases" }, { status: 500 });
  }
}