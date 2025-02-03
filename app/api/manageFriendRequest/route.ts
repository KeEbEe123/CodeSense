import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "";

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
    const { email, requesterEmail, action } = body;

    if (!email || !requesterEmail || !["accept", "deny"].includes(action)) {
      return NextResponse.json(
        { message: "Invalid request." },
        { status: 400 }
      );
    }

    // Connect to MongoDB and get the users collection
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    if (action === "accept") {
      // Accept the friend request: Add to friends and remove from pendingFriends
      await usersCollection.updateOne(
        { email },
        {
          $pull: { pendingFriends: { email: requesterEmail } },
          $push: { friends: { email: requesterEmail } },
        }
      );

      await usersCollection.updateOne(
        { email: requesterEmail },
        { $push: { friends: { email } } }
      );
    } else if (action === "deny") {
      // Deny the friend request: Remove from pendingFriends
      await usersCollection.updateOne(
        { email },
        { $pull: { pendingFriends: { email: requesterEmail } } }
      );
    }

    return NextResponse.json({ message: "Action completed successfully." });
  } catch (error) {
    console.error("Error in POST /api/manageFriendRequest:", error);
    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}
