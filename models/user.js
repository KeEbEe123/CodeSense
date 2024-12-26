import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        totalScore: { type: Number, default: 0 }, 
        platforms: {
            leetcode: { username: { type: String, default: null }, score: { type: Number, default: 0 } },
            codechef: { username: { type: String, default: null }, score: { type: Number, default: 0 } },
            codeforces: { username: { type: String, default: null }, score: { type: Number, default: 0 } },
        },
    },
    { timestamps: true }
); 

const User = models.User || mongoose.model("User", userSchema);
export default User;
