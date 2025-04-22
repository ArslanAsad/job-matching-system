const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  jobLink: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  summary: {
    type: String,
    default: "",
  },
  source: {
    type: String,
    enum: ["LinkedIn", "Indeed"],
    required: true,
  },
  relevanceScore: {
    type: Number,
    default: 0,
  },
  matchedKeywords: {
    type: [String],
    default: [],
  },
  keywordMatchCount: {
    type: Number,
    default: 0,
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resume",
    required: true,
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Job", JobSchema);
