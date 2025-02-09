import mongoose, { Schema, models } from "mongoose";

const courseSchema = new Schema(
  {
    courseId: { type: String, required: true, unique: true },
    courseName: { type: String, required: true },
    instructor: { type: String, required: true },
    description: { type: String, required: true },
    technology: { type: String, required: true },
    year: { type: Number, required: true },
    issuedBy: { type: String, required: true },
    participants: { type: Number, default: 0 },
    link: { type: String, required: true },
  },
  { timestamps: true, collection: "courses" }
);

const Course = models.Course || mongoose.model("Course", courseSchema);
export default Course;
