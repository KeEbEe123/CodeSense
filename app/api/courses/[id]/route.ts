import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import Course from "@/models/Course";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connectMongoDB();
  try {
    const body = await request.json();
    const updateCourse = await Course.findByIdAndUpdate(params.id, body, {
      new: true,
    });
    if (!updateCourse) {
      return NextResponse.json(
        { message: "Course not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Course updated successfully" });
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}
