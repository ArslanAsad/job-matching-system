const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const fs = require("fs");
const path = require("path");
const natural = require("natural");
const stopwords = require("stopwords").english;

// TF-IDF
const TfIdf = natural.TfIdf;

// Extract text from PDF file
const extractTextFromPdf = async (file) => {
  try {
    const dataBuffer = fs.readFileSync(file);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error("Failed to extract text from PDF");
  }
};

// Extract text from DOCX file
const extractTextFromDocx = async (file) => {
  try {
    const result = await mammoth.extractRawText({
      path: file,
    });
    return result.value;
  } catch (error) {
    console.error("Error extracting text from DOCX:", error);
    throw new Error("Failed to extract text from DOCX");
  }
};

// Extract text from resume
const extractText = async (file) => {
  const fileExtension = path.extname(file).toLowerCase();
  if (fileExtension === ".pdf") {
    return extractTextFromPdf(file);
  } else if (fileExtension === ".docx") {
    return extractTextFromDocx(file);
  } else {
    throw new Error("Unsupported file format");
  }
};

// Clean extracted text
const cleanText = (text) => {
  return text
    .replace(/\s+/g, " ") // replace multiple spaces with single space
    .replace(/[^\w\s]/g, " ") // remove punctuation
    .toLowerCase()
    .trim();
};

// Extract important keywords from text using TF-IDF
const extractKeywordsFromText = (text) => {
  const tfidf = new TfIdf();
  tfidf.addDocument(text);

  // commons skills to look for
  const commonSkills = [
    "javascript",
    "python",
    "java",
    "c++",
    "react",
    "angular",
    "vue",
    "node",
    "express",
    "mongodb",
    "sql",
    "nosql",
    "aws",
    "azure",
    "gcp",
    "docker",
    "kubernetes",
    "ci/cd",
    "agile",
    "scrum",
    "project management",
    "leadership",
    "communication",
    "teamwork",
    "problem solving",
    "critical thinking",
    "data analysis",
    "machine learning",
    "artificial intelligence",
    "ui/ux",
    "front-end",
    "back-end",
    "full-stack",
    "devops",
    "cloud",
    "microservices",
    "testing",
    "qa",
    "security",
    "blockchain",
  ];

  // word tokens
  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(text);

  // filter out stopwords and short words
  const filteredTokens = tokens.filter((token) => {
    token.length > 2 && !stopwords.includes(token);
  });

  // unique tokens
  const uniqueTokens = [...new Set(filteredTokens)];

  // get keywords based on TF-IDF score and common skills
  const keywords = [];
  const tfidfKeywords = [];
  tfidf
    .listTerms(0)
    .slice(0, 50)
    .forEach((item) => {
      if (item.term.length > 2 && !stopwords.includes(item.term)) {
        tfidfKeywords.push(item.term);
      }
    });
  keywords.push(...tfidfKeywords);

  // common skills found in text
  commonSkills.forEach((skill) => {
    if (text.includes(skill) && !keywords.includes(skill)) {
      keywords.push(skill);
    }
  });

  // multi-word skills
  const textLower = text.toLowerCase();
  const multiWordSkills = [
    "machine learning",
    "data science",
    "artificial intelligence",
    "natural language processing",
    "computer vision",
    "project management",
    "business intelligence",
    "data engineering",
    "cloud computing",
    "software development",
    "product management",
    "user experience",
    "digital marketing",
    "technical writing",
    "quality assurance",
  ];
  multiWordSkills.forEach((skill) => {
    if (textLower.includes(skill) && !keywords.includes(skill)) {
      keywords.push(skill);
    }
  });
  return [...new Set(keywords)];
};

// Main function to extract keywords from resume
exports.extractKeywords = async (file) => {
  try {
    const text = await extractText(file);
    const cleanedText = cleanText(text);
    const keywords = extractKeywordsFromText(cleanedText);
    return keywords;
  } catch (error) {
    console.error("Error extracting keywords:", error);
    throw error;
  }
};
