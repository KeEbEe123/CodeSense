import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import connectMongoDB from "@/lib/mongodb";
import Course from "@/models/Course";

const ADMIN_EMAILS = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",") || [];

export async function GET() {
  await connectMongoDB();
  try {
    const courses = await Course.find({});
    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json({ message: "Error fetching" }, { status: 500 });
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  let ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    request.ip ||
    "Unknown IP";

  // If multiple IPs exist, get the first one
  if (ip.includes(",")) {
    ip = ip.split(",")[0].trim();
  }

  console.log(`Incoming request from IP: ${ip}`);

  // Authentication and authorization checks
  if (!session || !session.user) {
    console.warn(`Unauthorized access attempt from IP: ${ip}`);
    return NextResponse.json(
      { message: "Unauthorized: You must be signed in" },
      { status: 401 }
    );
  }

  if (!ADMIN_EMAILS.includes(session.user.email)) {
    console.warn(
      `Forbidden access attempt by ${session.user.email} from IP: ${ip}`
    );
    return NextResponse.json(
      { message: "Forbidden: You don't have permission to add courses" },
      { status: 403 }
    );
  }

  await connectMongoDB();
  try {
    const body = await request.json();
    const course = new Course(body);
    await course.save();
    return NextResponse.json({ message: "Course added successfully" });
  } catch (error) {
    console.error("Error adding course:", error);
    return NextResponse.json(
      { message: "Failed to add course" },
      { status: 500 }
    );
  }
}
