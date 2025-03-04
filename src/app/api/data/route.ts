// app/api/data/route.ts

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb'; // Adjust path if needed

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);
    const collectionName = process.env.MONGODB_COLLECTION;
    if (!collectionName) {
      throw new Error('MONGODB_COLLECTION environment variable is not defined');
    }
    const collection = db.collection(collectionName);

    const data = await collection.find({}).toArray();
    return NextResponse.json({ data });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}