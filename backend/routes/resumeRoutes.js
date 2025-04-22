const express = require("express");
const router = express.Router();
const resumeController = require("../controllers/resumeController");
const multer = require("multer");
const path = require("path");

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter for PDF and DOCX only
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = [".pdf", ".docx"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedFileTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and DOCX files are allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

// Upload resume endpoint
router.post(
  "/upload-resume",
  upload.single("resume"),
  resumeController.uploadResume
);

module.exports = router;
