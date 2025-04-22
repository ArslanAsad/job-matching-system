const natural = require("natural");

// Calculate relevance score between job and resume keywords
const calculateRelevanceScore = (job, resumeKeywords) => {
  // combine job title and description for matching
  const jobText = `${job.jobTitle} ${job.company} ${job.description || ""} ${
    job.summary || ""
  }`.toLowerCase();

  // initialize counters
  let keywordMatches = 0;
  const matchedKeywords = [];

  // count keyword matches
  resumeKeywords.forEach((keyword) => {
    // check for exact matches
    if (jobText.includes(keyword.toLowerCase())) {
      keywordMatches++;
      matchedKeywords.push(keyword);
    }
  });

  // calculate basic score based on keyword matches
  const keywordScore = keywordMatches / Math.max(1, resumeKeywords.length);

  // calculate TF-IDF similarity
  const tfidfSimilarity = calculateTfidfSimilarity(
    job.description || "",
    resumeKeywords
  );

  // combine scores (keyword matches have higher weight)
  const totalScore = keywordScore * 0.7 + tfidfSimilarity * 0.3;

  // return job with score and matched keywords
  return {
    ...job,
    relevanceScore: totalScore,
    matchedKeywords: matchedKeywords,
    keywordMatchCount: keywordMatches,
  };
};

// Calculate TF-IDF similarity between job description and resume keywords
const calculateTfidfSimilarity = (jobDescription, resumeKeywords) => {
  if (!jobDescription || jobDescription.length === 0) {
    return 0;
  }

  // initialize TF-IDF
  const tfidf = new natural.TfIdf();

  // add job description as document
  tfidf.addDocument(jobDescription.toLowerCase());

  // add resume keywords as a single document
  tfidf.addDocument(resumeKeywords.join(" ").toLowerCase());

  // calculate similarity score
  let totalScore = 0;
  let maxPossibleScore = resumeKeywords.length;

  resumeKeywords.forEach((keyword) => {
    // get TF-IDF score for the keyword in job description
    const keywordScore = tfidf.tfidf(keyword.toLowerCase(), 0);
    totalScore += keywordScore;
  });

  // normalize score between 0 and 1
  return totalScore / Math.max(1, maxPossibleScore);
};

// Match jobs with resume keywords and rank by relevance
exports.matchJobsWithResume = (jobs, resumeKeywords, limit = 10) => {
  try {
    if (!jobs || jobs.length === 0) {
      return [];
    }

    if (!resumeKeywords || resumeKeywords.length === 0) {
      return jobs.slice(0, limit);
    }

    // calculate relevance score for each job
    const scoredJobs = jobs.map((job) =>
      calculateRelevanceScore(job, resumeKeywords)
    );

    // sort jobs by relevance score (descending)
    const rankedJobs = scoredJobs.sort(
      (a, b) => b.relevanceScore - a.relevanceScore
    );

    // return top N jobs
    return rankedJobs.slice(0, limit);
  } catch (error) {
    console.error("Error matching jobs with resume:", error);
    return jobs.slice(0, limit);
  }
};
