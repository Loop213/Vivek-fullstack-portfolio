const Resume = require("../models/Resume");

async function getResume(_req, res) {
  const resume = await Resume.findOne();
  return res.json({ resume });
}

async function updateResume(req, res) {
  const payload = {
    ...req.body,
    threeDDesign: req.body.threeDDesign === "design2" ? "design2" : "design1"
  };
  const resume = await Resume.findOneAndUpdate({}, payload, { new: true, upsert: true });
  return res.json({ resume });
}

module.exports = { getResume, updateResume };
