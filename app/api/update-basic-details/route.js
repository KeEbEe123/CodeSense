import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../lib/mongodb";
import User from "../../../models/user";

export async function POST(request) {
  try {
    const { rollno, about, contact, linkedIn, email, department } =
      await request.json();

    if (!email || !rollno || !contact) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    user.rollno = rollno;
    user.About = about;
    user.linkedIn = linkedIn;
    user.Contact = contact;
    user.department = department;
    user.section = section;

    await user.save();

    return NextResponse.json(
      { message: "Basic details updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating basic details:", error);
    return NextResponse.json(
      {
        message:
          "User already exists. Please check your details and try again.",
      },
      { status: 500 }
    );
  }
}
