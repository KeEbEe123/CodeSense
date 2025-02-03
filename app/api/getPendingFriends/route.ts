import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { getServerSession } from "next-auth"; // Import from next-auth
import { authOptions } from "../auth/[...nextauth]/route"; // Update path to match your auth file

const uri = process.env.MONGODB_URI || "";

let client: MongoClient;

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client.db();
}

export async function GET(request: Request) {
  try {
    // Get the logged-in user's session
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { message: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    const currentUserEmail = session.user.email; // Get the email from the session
    console.log("Logged-in user's email:", currentUserEmail);

    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ email: currentUserEmail });

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ pendingFriends: user.pendingFriends || [] });
  } catch (error) {
    console.error("Error in GET /api/getPendingFriends:", error);
    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}
