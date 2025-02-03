import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || ""; // Your MongoDB URI

let client: MongoClient;

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client.db(); // Returns the database instance
}

export async function POST(request: Request) {
  try {
    const body = await request.json(); // Parse the JSON body
    const { userId, internship } = body;
    console.log("userId", userId);

    if (!userId || !internship) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection("users"); // Ensure the collection name matches

    // Update the user's internships array
    const result = await usersCollection.updateOne(
      { email: { $regex: `^${userId}$`, $options: "i" } }, // Match by user ID
      { $push: { internships: internship } } // Add internship to the internships array
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Internship added successfully." });
  } catch (error) {
    console.error("Error in POST /api/addInternship:", error);
    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}
