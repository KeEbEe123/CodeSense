import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import fs from "fs/promises";
import path from "path";
import multer from "multer";
import { NextRequest } from "next/server";

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

// Define where images are stored on EC2
const UPLOADS_DIR = "/home/certifications/uploads";

// Multer storage config
const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// API Route to Edit a Certification
export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();

    const userId = formData.get("userId") as string;
    const oldName = formData.get("oldName") as string;
    const oldIssuer = formData.get("oldIssuer") as string;
    const name = formData.get("name") as string;
    const issuer = formData.get("issuer") as string;
    const date = formData.get("date") as string;
    const image = formData.get("image") as File | null;

    if (!userId || !oldName || !oldIssuer) {
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

    // Find the certification to update
    const certificationIndex = user.certifications.findIndex(
      (cert: { name: string; issuer: string }) =>
        cert.name === oldName && cert.issuer === oldIssuer
    );

    if (certificationIndex === -1) {
      return NextResponse.json(
        { message: "Certification not found." },
        { status: 404 }
      );
    }

    let newImageUrl = user.certifications[certificationIndex].imageUrl;

    // If a new image is uploaded, replace the old one
    if (image) {
      const oldFileName = newImageUrl.split("/").pop();
      const oldFilePath = path.join(UPLOADS_DIR, oldFileName);

      try {
        await fs.unlink(oldFilePath);
      } catch (err) {
        console.warn(`Old file not found: ${oldFilePath}`);
      }

      const newFileName = `${Date.now()}-${image.name}`;
      const newFilePath = path.join(UPLOADS_DIR, newFileName);

      // Save new image
      const buffer = Buffer.from(await image.arrayBuffer());
      await fs.writeFile(newFilePath, buffer);

      newImageUrl = `/uploads/${newFileName}`;
    }

    // Update the certification details
    const updateQuery = {
      $set: {
        [`certifications.${certificationIndex}.name`]: name,
        [`certifications.${certificationIndex}.issuer`]: issuer,
        [`certifications.${certificationIndex}.date`]: date,
        [`certifications.${certificationIndex}.imageUrl`]: newImageUrl,
      },
    };

    const result = await usersCollection.updateOne(
      { email: userId },
      updateQuery
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: "Failed to update certification." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Certification updated successfully!",
      newImageUrl,
    });
  } catch (error) {
    console.error("Error in PUT /api/editCertification:", error);
    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}
