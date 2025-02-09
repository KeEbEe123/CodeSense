import { NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import Opportunity from "@/models/Opportunity";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connectMongoDB();
  try {
    const { email } = await request.json();
    const opportunity = await Opportunity.findById(params.id);

    if (!opportunity) {
      return NextResponse.json(
        { message: "Opportunity not found" },
        { status: 404 }
      );
    }

    const hasApplied = opportunity.applied.includes(email);
    const update = hasApplied
      ? { $pull: { applied: email } }
      : { $addToSet: { applied: email } };

    await Opportunity.findByIdAndUpdate(params.id, update);
    return NextResponse.json({
      message: hasApplied ? "Application removed" : "Applied successfully",
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    return NextResponse.json({ message: "Update failed" }, { status: 500 });
  }
}
