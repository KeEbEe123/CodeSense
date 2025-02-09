import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import Course from "@/models/Course";

export async function GET() {
  await connectMongoDB();
  try {
    const courses = await Course.find({});
    return NextResponse.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { message: "Error fetching data" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
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
