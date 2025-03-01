import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    // Define the directory where JSON files are stored
    const dirPath = path.join(process.cwd(), "public", "data");

    // Read all files in the directory
    const files = fs.readdirSync(dirPath).filter((file: string) => file.endsWith(".json"));

    // Return the list of JSON files as a response
    return NextResponse.json({ files }, { status: 200 });
  } catch (error) {
    console.error("Error reading JSON files:", error);
    return NextResponse.json(
      { error: "Failed to fetch JSON files" },
      { status: 500 }
    );
  }
}