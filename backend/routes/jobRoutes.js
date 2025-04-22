const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");

router.post("/search-jobs", jobController.searchJobs);
router.get("/saved-jobs/:resumeId", jobController.getSavedJobs);

module.exports = router;
