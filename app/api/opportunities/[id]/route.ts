import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import Opportunity from "@/models/Opportunity";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connectMongoDB();
  try {
    const body = await request.json();
    const updatedOpportunity = await Opportunity.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    );
    if (!updatedOpportunity) {
      return NextResponse.json(
        { message: "Opportunity not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Opportunity updated successfully" });
  } catch (error) {
    console.error("Error updating opportunity:", error);
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}
