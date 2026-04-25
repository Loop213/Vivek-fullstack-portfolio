const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const Resume = require("../models/Resume");

async function seedDefaults() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@12345";

  const existingAdmin = await Admin.findOne({ email: adminEmail });
  if (!existingAdmin) {
    // Seed the first admin account from env so credentials never live in source control.
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await Admin.create({ email: adminEmail, passwordHash });
  }

  const existingResume = await Resume.findOne();
  if (!existingResume) {
    // Seed a polished default resume so the portfolio is useful right after setup.
    await Resume.create({
      name: "Vivek Kumar",
      role: "Full Stack Developer",
      avatarUrl: "",
      threeDEnabled: true,
      threeDDesign: "design1",
      bio: "I build polished full-stack applications with a strong focus on performance, interactive interfaces, scalable APIs, and thoughtful user experience. My work blends React, Node.js, MongoDB, and 3D UI techniques to create products that feel both modern and memorable.",
      skills: ["JavaScript", "Node.js", "Express", "MongoDB", "React", "Three.js"],
      education: [
        {
          degree: "Bachelor of Technology in Computer Science",
          school: "Your University",
          year: "2021 - 2025",
          details: "Focused on full-stack development, system design, and interactive web experiences."
        }
      ],
      experience: [
        {
          title: "Full Stack Developer",
          company: "Freelance / Personal Projects",
          period: "2023 - Present",
          highlights: [
            "Built responsive MERN applications with secure authentication and RESTful APIs.",
            "Created visually rich frontend experiences using React, Three.js, and motion design.",
            "Integrated third-party APIs and data layers with resilient fallback strategies."
          ]
        }
      ],
      contact: {
        email: "vivek@example.com",
        phone: "+91 00000 00000",
        location: "India",
        github: "https://github.com/loop213",
        linkedin: "https://www.linkedin.com/in/vivek-kumar-7455202aa/",
        leetcode: "https://leetcode.com/u/Vivek2103/"
      },
      githubAutoFetch: true
    });
  } else {
    const updates = {};
    if (existingResume.avatarUrl === undefined) {
      updates.avatarUrl = "";
    }
    if (existingResume.threeDEnabled === undefined) {
      updates.threeDEnabled = true;
    }
    if (existingResume.threeDDesign === undefined) {
      updates.threeDDesign = "design1";
    }

    if (Object.keys(updates).length > 0) {
      await Resume.updateOne({ _id: existingResume._id }, { $set: updates });
    }
  }
}

module.exports = seedDefaults;
