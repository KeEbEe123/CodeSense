import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import fs from "fs/promises";
import path from "path";
import { writeFile } from "fs/promises";
import mime from "mime";

// MongoDB Connection
const uri = process.env.MONGODB_URI || ""; // Ensure this is set in your .env
let client: MongoClient;

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client.db();
}

// Ensure /uploads directory exists
const uploadDir = "/home/certifications/uploads"; // Change this path if necessary

async function ensureUploadsDir() {
  try {
    await fs.mkdir(uploadDir, { recursive: true });
  } catch (err) {
    console.error("Error creating uploads directory:", err);
  }
}

// API Route
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const userId = formData.get("userId") as string;
    const name = formData.get("name") as string;
    const issuer = formData.get("issuer") as string;
    const date = formData.get("date") as string;
    const imageFile = formData.get("image") as File | null;

    if (!userId || !name || !issuer || !date || !imageFile) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    // Check file size (2MB max)
    if (imageFile.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { message: "File size exceeds 2MB. Please upload a smaller image." },
        { status: 400 }
      );
    }

    // Ensure uploads directory exists
    await ensureUploadsDir();

    // Generate unique filename
    const fileExt = mime.getExtension(imageFile.type) || "jpg";
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${fileExt}`;
    const filePath = path.join(uploadDir, fileName);

    // Save file locally
    const fileBuffer = Buffer.from(await imageFile.arrayBuffer());
    await writeFile(filePath, fileBuffer);

    // Store only relative path or public URL
    const imageUrl = `http://13.201.91.147/uploads/${fileName}`; // Replace with your EC2 IP or domain

    // Connect to database
    const db = await connectToDatabase();
    const usersCollection = db.collection("users");

    // Check if certification already exists
    const existingCertification = await usersCollection.findOne({
      email: userId,
      "certifications.name": name,
      "certifications.issuer": issuer,
    });

    if (existingCertification) {
      return NextResponse.json(
        { message: "This certification already exists." },
        { status: 400 }
      );
    }

    // Add certification to user's profile
    const newCertification = { name, issuer, date, imageUrl };
    const result = await usersCollection.updateOne(
      { email: userId },
      { $push: { certifications: newCertification } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    return NextResponse.json({
      message: "Certification added successfully.",
      certification: newCertification,
    });
  } catch (error) {
    console.error("Error in POST /api/addCertification:", error);
    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}
