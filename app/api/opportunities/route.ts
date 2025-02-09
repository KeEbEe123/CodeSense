import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import Opportunity from "@/models/Opportunity";

export async function GET() {
  await connectMongoDB();
  try {
    const opportunities = await Opportunity.find({});
    return NextResponse.json(opportunities);
  } catch (error) {
    console.error("Error fetching opportunities:", error);
    return NextResponse.json(
      { message: "Error fetching data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  await connectMongoDB();
  try {
    const body = await request.json();
    const opportunity = new Opportunity(body);
    await opportunity.save();
    return NextResponse.json({ message: "Opportunity added successfully" });
  } catch (error) {
    console.error("Error adding opportunity:", error);
    return NextResponse.json(
      { message: "Failed to add opportunity" },
      { status: 500 }
    );
  }
}
