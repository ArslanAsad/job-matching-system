const Job = require("../models/Job");
const Resume = require("../models/Resume");
const jobScraper = require("../utils/jobScraper");
const matchingAlgorithm = require("../utils/matchingAlgorithm");

// Search for jobs and match with resume
exports.searchJobs = async (req, res) => {
  try {
    const { resumeId, location, limit = 10 } = req.body;

    if (!resumeId || !location) {
      return res.status(400).json({
        message: "Resume ID and location are required",
      });
    }

    // get resume keywords
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    const keywords = resume.keywords;

    // scrape jobs from LinkedIn and Indeed
    const jobs = await jobScraper.scrapeJobs(keywords, location);

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({
        message: "No jobs found",
      });
    }

    // match jobs with resume keywords
    const matchedJobs = matchingAlgorithm.matchJobsWithResume(
      jobs,
      keywords,
      limit
    );

    // save matched jobs to database
    const savedJobs = [];

    for (const job of matchedJobs) {
      // check if job already exists
      const existingJob = await Job.findOne({
        jobLink: job.jobLink,
        resumeId: resumeId,
      });

      if (existingJob) {
        // update existing job
        existingJob.relevanceScore = job.relevanceScore;
        existingJob.matchedKeywords = job.matchedKeywords;
        existingJob.keywordMatchCount = job.keywordMatchCount;
        existingJob.dateAdded = Date.now();

        await existingJob.save();
        savedJobs.push(existingJob);
      } else {
        // create new job
        const newJob = new Job({
          ...job,
          resumeId: resumeId,
        });

        await newJob.save();
        savedJobs.push(newJob);
      }
    }

    res.status(200).json({
      message: "Jobs scraped and matched successfully",
      jobs: savedJobs,
    });
  } catch (error) {
    console.error("Error searching jobs:", error);
    res.status(500).json({
      message: "Error searching jobs",
      error: error.message,
    });
  }
};

// Get saved jobs for a resume
exports.getSavedJobs = async (req, res) => {
  try {
    const { resumeId } = req.params;

    if (!resumeId) {
      return res.status(400).json({
        message: "Resume ID is required",
      });
    }

    // get resume
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    // get jobs for resume
    const jobs = await Job.find({ resumeId: resumeId })
      .sort({ relevanceScore: -1 })
      .limit(10);

    res.status(200).json({
      message: "Jobs retrieved successfully",
      resumeKeywords: resume.keywords,
      jobs: jobs,
    });
  } catch (error) {
    console.error("Error getting saved jobs:", error);
    res.status(500).json({
      message: "Error getting saved jobs",
      error: error.message,
    });
  }
};
