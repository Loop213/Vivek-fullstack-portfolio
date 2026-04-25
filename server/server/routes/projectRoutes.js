const express = require("express");
const { getProjects, getProjectsForAdmin, getProject, addProject, updateProject, deleteProject } = require("../controllers/projectController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getProjects);
router.get("/admin/all", authMiddleware, getProjectsForAdmin);
router.get("/:id", getProject);
router.post("/", authMiddleware, addProject);
router.put("/:id", authMiddleware, updateProject);
router.delete("/:id", authMiddleware, deleteProject);

module.exports = router;
