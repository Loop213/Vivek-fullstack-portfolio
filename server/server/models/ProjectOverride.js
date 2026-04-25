const mongoose = require("mongoose");

const projectOverrideSchema = new mongoose.Schema(
  {
    githubId: { type: String, required: true, unique: true },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    url: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    liveUrl: { type: String, default: "" },
    techStack: [{ type: String }],
    highlights: [{ type: String }],
    stars: { type: Number, default: 0 },
    hidden: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProjectOverride", projectOverrideSchema);
