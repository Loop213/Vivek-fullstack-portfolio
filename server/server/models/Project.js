const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    url: { type: String, required: true },
    githubUrl: { type: String, default: "" },
    liveUrl: { type: String, default: "" },
    techStack: [{ type: String }],
    highlights: [{ type: String }],
    stars: { type: Number, default: 0 },
    source: {
      type: String,
      enum: ["manual", "github"],
      default: "manual"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
