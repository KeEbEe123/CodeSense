import mongoose, { Schema, models } from "mongoose";

const opportunitySchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    company: { type: String, required: true },
    duration: { type: String, required: true },
    mainLink: { type: String, required: true },
    departments: { type: [String], required: true },
    applied: { type: [String], default: [] },
  },
  { timestamps: true }
);

const Opportunity =
  models.Opportunity || mongoose.model("Opportunity", opportunitySchema);
export default Opportunity;
