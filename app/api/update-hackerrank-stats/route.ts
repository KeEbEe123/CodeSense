import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(request: Request) {
  try {
    const { email, hackerrankUsername } = await request.json();

    if (!hackerrankUsername) {
      return NextResponse.json(
        { message: "Username is required" },
        { status: 400 }
      );
    }

    const score = await scrapeHackerRank(hackerrankUsername);
    if (score === null) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Success", score }, { status: 200 });
  } catch (error) {
    console.error("Scraping Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

async function scrapeHackerRank(username: string): Promise<number | null> {
  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    const url = `https://www.hackerrank.com/${username}`;
    await page.goto(url, { waitUntil: "domcontentloaded" });

    // ✅ Alternative way to check if "Page Not Found" exists
    const notFound = await page.evaluate(() => {
      return document.body.innerText.includes("Page Not Found");
    });

    if (notFound) {
      await browser.close();
      return null;
    }

    // ✅ Extract the rating score
    const score = await page.evaluate(() => {
      const scoreElement = document.querySelector(".rating-number");
      return scoreElement
        ? parseInt(scoreElement.textContent || "0", 10)
        : null;
    });

    await browser.close();
    return score;
  } catch (error) {
    console.error("Scraping failed:", error);
    return null;
  }
}
