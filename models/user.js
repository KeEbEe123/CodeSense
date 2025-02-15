import mongoose, { Schema, models } from "mongoose";
import { v4 as uuidv4 } from "uuid";

// Define schema for day changes
const dayChangeSchema = new Schema(
  {
    date: { type: Date, default: null },
    change: { type: Number, default: 0 }, // Positive for increase, negative for decrease
  },
  { _id: false, autoIndex: false }
);

// Define schema for internships
const internshipSchema = new Schema(
  {
    title: { type: String, default: "" },
    company: { type: String, default: "" },
    startDate: { type: String, default: "" },
    endDate: { type: String, default: "" },
  },
  { _id: false, autoIndex: false }
);
const friendSchema = new Schema(
  {
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    image: { type: String, default: "" },
  },
  { _id: false, autoIndex: false }
);
const PendingFriendSchema = new Schema(
  {
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    image: { type: String, default: "" },
  },
  { _id: false, autoIndex: false }
);

// Define schema for certifications
const certificationsSchema = new Schema(
  {
    name: { type: String, default: "" },
    issuer: { type: String, default: "" },
    date: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { _id: false, autoIndex: false }
);

// Define the main user schema
const userSchema = new Schema(
  {
    id: { type: String, default: () => uuidv4(), unique: true },
    rank: { type: Number, unique: true },
    email: { type: String, default: null, unique: true },
    name: { type: String, default: "" },
    onboard: { type: Boolean, default: false },
    department: { type: String, default: "" },
    section: { type: String, default: "" },
    graduationYear: { type: String, default: "" },
    parentContact: { type: String, default: "" },
    image: { type: String, default: null },
    totalScore: { type: Number, default: 0 }, // Total score of the user
    rollno: { type: String, default: "", unique: true },
    Skills: { type: String, default: "" },
    About: { type: String, default: "" },
    Contact: { type: String, default: "" },
    ParentContact: { type: String, default: "" },
    linkedIn: { type: String, default: "" },
    projects: { type: String, default: "" },
    achievements: { type: String, default: "" },
    certifications: [certificationsSchema],
    internships: [internshipSchema],
    pendingFriends: [PendingFriendSchema],
    friends: [friendSchema],
    programmingLanguages: { type: String, default: "" },
    platforms: {
      leetcode: {
        username: { type: String, default: null },
        score: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
      },
      codechef: {
        username: { type: String, default: null },
        score: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
      },
      codeforces: {
        username: { type: String, default: null },
        score: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
      },
      github: {
        username: { type: String, default: null },
        score: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
      },
      geeksforgeeks: {
        username: { type: String, default: null },
        score: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
      },
      hackerrank: {
        username: { type: String, default: null },
        score: { type: Number, default: 0 },
        total: { type: Number, default: 0 },
      },
    },
    profilePicture: { type: String, default: null },

    dayChanges: [dayChangeSchema], // An array to track daily changes in score
  },
  { timestamps: true, autoIndex: false }
);

const User = models.User || mongoose.model("User", userSchema);
export default User;
