const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema(
  {
    degree: String,
    school: String,
    year: String,
    details: String
  },
  { _id: false }
);

const experienceSchema = new mongoose.Schema(
  {
    title: String,
    company: String,
    period: String,
    highlights: [String]
  },
  { _id: false }
);

const contactSchema = new mongoose.Schema(
  {
    email: String,
    phone: String,
    location: String,
    github: String,
    linkedin: String,
    leetcode: String
  },
  { _id: false }
);

const resumeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    bio: { type: String, required: true },
    avatarUrl: { type: String, default: "" },
    threeDEnabled: { type: Boolean, default: true },
    threeDDesign: { type: String, enum: ["design1", "design2"], default: "design1" },
    skills: [{ type: String }],
    education: [educationSchema],
    experience: [experienceSchema],
    contact: contactSchema,
    githubAutoFetch: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);
