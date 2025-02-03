import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "";

let client: MongoClient;

async function connectToDatabase() {
  if (!client) {
    console.log("Connecting to MongoDB...");
    client = new MongoClient(uri);
    await client.connect();
    console.log("MongoDB connected successfully.");
  }
  return client.db();
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      console.log("Email is missing in the query parameters.");
      return NextResponse.json(
        { message: "Email is required as a query parameter." },
        { status: 400 }
      );
    }

    console.log("Searching for email:", email);
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({
      email: { $regex: `^${email}$`, $options: "i" },
    });

    if (!user) {
      console.log("User not found for email:", email);
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    console.log("User found:", user);
    const { password, ...userWithoutPassword } = user;
    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error("Error in GET /api/getUserByEmail:", error);
    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}
