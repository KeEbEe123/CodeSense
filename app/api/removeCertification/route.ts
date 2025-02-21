import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import fs from "fs/promises";
import path from "path";

// MongoDB Connection
const uri = process.env.MONGODB_URI || "";
let client: MongoClient;

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client.db();
}

// API Route to Remove a Certification
export async function DELETE(request: Request) {
  try {
    const { userId, name, issuer } = await request.json();

    if (!userId || !name || !issuer) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    // Find the user
    const user = await usersCollection.findOne({ email: userId });
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // Find the certification
    const certification = user.certifications.find(
      (cert: { name: string; issuer: string; imageUrl: string }) =>
        cert.name === name && cert.issuer === issuer
    );

    if (!certification) {
      return NextResponse.json(
        { message: "Certification not found." },
        { status: 404 }
      );
    }

    // Extract file name from image URL
    const fileName = certification.imageUrl.split("/").pop();
    if (!fileName) {
      return NextResponse.json(
        { message: "Invalid image URL." },
        { status: 400 }
      );
    }

    // Define the full path to the image file
    const filePath = path.join("/home/certifications/uploads", fileName);

    // Delete the image file from the EC2 instance
    try {
      await fs.unlink(filePath);
      console.log(`File deleted: ${filePath}`);
    } catch (err) {
      console.warn(`File not found or already deleted: ${filePath}`, err);
    }

    // Remove certification from database
    const result = await usersCollection.updateOne(
      { email: userId },
      { $pull: { certifications: { name, issuer } } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: "Failed to remove certification." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Certification removed successfully.",
    });
  } catch (error) {
    console.error("Error in DELETE /api/removeCertification:", error);
    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}
