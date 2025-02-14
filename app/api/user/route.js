import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../lib/mongodb";
import User from "../../../models/user";

const ADMIN_EMAILS = [
  "keertan.k@gmail.com",
  "admin2@example.com",
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

export async function POST(request) {
  const { name, email, image } = await request.json();
  const onboard = ADMIN_EMAILS.includes(email);
  await connectMongoDB();
  await User.create({ name, email, image, onboard });
  return NextResponse.json({ message: "User Registered" }, { status: 201 });
}
