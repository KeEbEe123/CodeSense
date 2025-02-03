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
    const { email, targetEmail } = body;

    if (!email || !targetEmail) {
      return NextResponse.json(
        { message: "Email and target email are required." },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    // Check if the target user exists
    const targetUser = await usersCollection.findOne({ email: targetEmail });
    if (!targetUser) {
      return NextResponse.json(
        { message: "Target user not found." },
        { status: 404 }
      );
    }

    // Check if the users are already friends
    const currentUser = await usersCollection.findOne({ email });
    const alreadyFriends = currentUser?.friends?.some(
      (friend: any) => friend.email === targetEmail
    );

    if (alreadyFriends) {
      return NextResponse.json(
        { message: "You are already friends with this user." },
        { status: 400 }
      );
    }

    // Check if a friend request is already pending
    const requestAlreadySent = targetUser.pendingFriends?.some(
      (pending: any) => pending.email === email
    );

    if (requestAlreadySent) {
      return NextResponse.json(
        { message: "Friend request already sent." },
        { status: 400 }
      );
    }

    // Add the friend request to the target user's pendingFriends
    await usersCollection.updateOne(
      { email: targetEmail },
      {
        $push: {
          pendingFriends: {
            email,
          },
        },
      }
    );

    return NextResponse.json({ message: "Friend request sent successfully." });
  } catch (error) {
    console.error("Error in POST /api/addFriendRequest:", error);
    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}
