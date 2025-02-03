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
    const { userId, certification } = body;

    if (!userId || !certification) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection("users"); // Ensure the collection name matches

    // Check if the certification already exists for this user
    const existingCertification = await usersCollection.findOne({
      email: userId,
      "certifications.name": certification.name,
      "certifications.issuer": certification.issuer,
    });

    if (existingCertification) {
      return NextResponse.json(
        { message: "This certification already exists." },
        { status: 400 }
      );
    }

    // Update the user's certifications array by adding the new certification
    const result = await usersCollection.updateOne(
      { email: userId }, // Match by user ID
      { $push: { certifications: certification } } // Add certification to the certifications array
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Certification added successfully." });
  } catch (error) {
    console.error("Error in POST /api/addCertification:", error);
    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}
