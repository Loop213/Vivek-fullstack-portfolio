const express = require("express");
const { getResume, updateResume } = require("../controllers/resumeController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getResume);
router.put("/", authMiddleware, updateResume);

module.exports = router;
