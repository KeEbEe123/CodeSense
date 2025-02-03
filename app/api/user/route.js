import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../lib/mongodb";
import User from "../../../models/user";

export async function POST(request) {
  const { name, email, image } = await request.json();
  await connectMongoDB();
  await User.create({ name, email, image });
  return NextResponse.json({ message: "User Registered" }, { status: 201 });
}
