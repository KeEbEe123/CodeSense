import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth/[...nextauth]";
import connectMongoDB from "@/lib/mongodb";
import Course from "@/models/Course";

const ADMIN_EMAILS = [
  "keertan.k@gmail.com",
  "siddhartht4206@gmail.com",
  "23r21a12b3@mlrit.ac.in",
  "23r21a1285@mlrit.ac.in",
  "nv.rajasekhar@gmail.com",
  "rajasekhar.nv@gmail.com",
  "hodds@mlrinstitutions.ac.in",
  "hodaiml@mlrinstitutions.ac.in",
  "hodit@mlrinstitutions.ac.in",
  "hodcse@mlrinstitutions.ac.in",
  "pradeep13@mlrinstitutions.ac.in",
];

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
  const session = await getServerSession(authOptions);

  // Check if user is signed in
  if (!session || !session.user) {
    return NextResponse.json(
      { message: "Unauthorized: You must be signed in" },
      { status: 401 }
    );
  }

  // Check if user is an admin
  if (!ADMIN_EMAILS.includes(session.user.email)) {
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
