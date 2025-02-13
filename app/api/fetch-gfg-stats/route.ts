import { NextResponse } from "next/server";
import {
  fetchDirectProfileData,
  fetchNewProfileData,
} from "../../../utils/gfgfetcher"; // Assume this file contains the provided GFG scraper functions

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { message: "Username is required" },
        { status: 400 }
      );
    }

    let data = await fetchDirectProfileData(username);
    if (!data) {
      data = await fetchNewProfileData(username); // Fallback if direct API fails
    }

    if (!data) {
      return NextResponse.json(
        { message: "User not found or no stats available" },
        { status: 404 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching GFG stats:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
