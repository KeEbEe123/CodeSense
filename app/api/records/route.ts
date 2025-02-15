import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || ""; // Ensure you have your MongoDB URI in .env

let client: MongoClient;

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client.db();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, type, record } = body;

    if (!userId || !type || !record) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    // Ensure valid type
    if (!["certifications", "internships"].includes(type)) {
      return NextResponse.json({ message: "Invalid type." }, { status: 400 });
    }

    // Check for duplicate entry
    const existingEntry = await usersCollection.findOne({
      email: userId,
      [`${type}.name`]: record.name,
      [`${type}.issuer`]: record.issuer,
    });

    if (existingEntry) {
      return NextResponse.json(
        { message: "This record already exists." },
        { status: 400 }
      );
    }

    // Add new entry to user's array
    const result = await usersCollection.updateOne(
      { email: userId },
      { $push: { [type]: record } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Record added successfully." });
  } catch (error) {
    console.error("Error in POST /api/records:", error);
    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { userId, type, recordName, issuer } = body;

    if (!userId || !type || !recordName || !issuer) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    // Remove the record
    const result = await usersCollection.updateOne(
      { email: userId },
      { $pull: { [type]: { name: recordName, issuer } } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: "Record not found or already removed." },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Record removed successfully." });
  } catch (error) {
    console.error("Error in DELETE /api/records:", error);
    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}
