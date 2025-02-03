import { MongoClient } from "mongodb";
import * as XLSX from "xlsx/xlsx.mjs";

const MONGO_URI = process.env.MONGODB_URI;
const DB_NAME = "test";
const COLLECTION_NAME = "users";

export async function GET(req) {
  try {
    const client = await MongoClient.connect(MONGO_URI);
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Fetch all users
    const users = await collection.find({}).toArray();
    client.close(); // Close MongoDB connection after fetching data

    if (!users.length) {
      return new Response(JSON.stringify({ message: "No users found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const workbook = XLSX.utils.book_new(); // Create new Excel workbook

    // ================== 📌 Format Main User Data Sheet ==================
    const userSheetData = users.map((user) => ({
      ID: user.id,
      Name: user.name,
      Email: user.email,
      Rank: user.rank,
      RollNo: user.rollno,
      Department: user.department,
      Skills: user.Skills,
      About: user.About,
      Contact: user.Contact,
      LinkedIn: user.linkedIn,
      Projects: user.projects,
      Achievements: user.achievements,
      ProgrammingLanguages: user.programmingLanguages,
      TotalScore: user.totalScore,
      ProfilePicture: user.profilePicture,
      CreatedAt: user.createdAt,
      UpdatedAt: user.updatedAt,
    }));

    const userSheet = XLSX.utils.json_to_sheet(userSheetData);
    XLSX.utils.book_append_sheet(workbook, userSheet, "Users");

    // ================== 🎯 Format Platforms Data Sheet ==================
    let platformsSheetData = users.map((user) => {
      const platforms = user.platforms || {};
      return {
        UserID: user.id,
        Name: user.name,
        LeetCodeUsername: platforms.leetcode?.username || "N/A",
        LeetCodeScore: platforms.leetcode?.score || 0,
        CodeforcesUsername: platforms.codeforces?.username || "N/A",
        CodeforcesScore: platforms.codeforces?.score || 0,
        CodeChefUsername: platforms.codechef?.score || 0,
        CodeChefScore: platforms.codechef?.score || 0,
        GithubUsername: platforms.github?.score || 0,
        GithubCommits: platforms.github?.score || 0,
        // Add other platforms similarly
      };
    });

    if (platformsSheetData.length > 0) {
      const platformsSheet = XLSX.utils.json_to_sheet(platformsSheetData);
      XLSX.utils.book_append_sheet(workbook, platformsSheet, "Platforms");
    }

    // ================== 🎓 Format Certifications Sheet ==================
    let certificationsSheetData = [];
    users.forEach((user) => {
      user.certifications?.forEach((cert) => {
        certificationsSheetData.push({
          UserID: user.id,
          Name: cert.name,
          Issuer: cert.issuer,
          Date: cert.date,
          Description: cert.description,
        });
      });
    });

    if (certificationsSheetData.length > 0) {
      const certificationsSheet = XLSX.utils.json_to_sheet(
        certificationsSheetData
      );
      XLSX.utils.book_append_sheet(
        workbook,
        certificationsSheet,
        "Certifications"
      );
    }

    // ================== 🏢 Format Internships Sheet ==================
    let internshipsSheetData = [];
    users.forEach((user) => {
      user.internships?.forEach((intern) => {
        internshipsSheetData.push({
          UserID: user.id,
          Title: intern.title,
          Company: intern.company,
          StartDate: intern.startDate,
          EndDate: intern.endDate,
        });
      });
    });

    if (internshipsSheetData.length > 0) {
      const internshipsSheet = XLSX.utils.json_to_sheet(internshipsSheetData);
      XLSX.utils.book_append_sheet(workbook, internshipsSheet, "Internships");
    }

    // ================== 📤 Generate and Return Excel File ==================
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    return new Response(buffer, {
      headers: {
        "Content-Disposition": "attachment; filename=database_export.xlsx",
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error) {
    console.error("Error exporting data:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
