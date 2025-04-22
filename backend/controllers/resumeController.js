const Resume = require("../models/Resume");
const resumeParser = require("../utils/resumeParser");

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // extract keywords from uploaded resume
    const keywords = await resumeParser.extractKeywords(req.file.path);

    // create new resume document
    const resume = new Resume({
      filename: req.file.filename,
      path: req.file.path,
      keywords: keywords,
      uploadDate: Date.now(),
    });

    // save to database
    await resume.save();

    res.status(201).json({
      message: "Resume uploaded successfully",
      resume: {
        id: resume._id,
        filename: resume.filename,
        keywords: resume.keywords,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error uploading resume",
      error: error.message,
    });
  }
};
