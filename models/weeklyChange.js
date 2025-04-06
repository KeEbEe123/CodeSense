// models/weeklyChange.ts

import mongoose, { Schema, models } from "mongoose";

const weeklyChangeSchema = new Schema(
  {
    email: { type: String, required: true },
    previousScore: { type: Number, required: true },
    currentScore: { type: Number, required: true },
    difference: { type: Number, required: true },
  },
  { timestamps: true }
);

const WeeklyChange = models.WeeklyChange || mongoose.model("WeeklyChange", weeklyChangeSchema);
export default WeeklyChange;
