# Job Matching System

A job matching system that parses resumes, scrapes job listings from LinkedIn and Indeed, and ranks jobs based on relevance to the resume.

# [Live Demo](https://job-scraper-frontend-omega.vercel.app/)

## Features

- Resume upload and parsing (PDF/DOCX formats)
- Automatic keyword extraction from resumes
- Job scraping from LinkedIn and Indeed
- Matching algorithm to rank jobs by relevance to resume keywords
- MongoDB storage for resumes and matched jobs
- RESTful API for integration with frontends

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ORM
- **Resume Parsing**: pdf-parse, mammoth
- **Web Scraping**: Puppeteer, Cheerio
- **Text Analysis**: Natural (NLP)
- **File Upload**: Multer

## Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB

### Setup

1. Clone the repository

```bash
git clone https://github.com/yourusername/job-matching-system.git
cd job-matching-system
```

2. Install dependencies

```bash
npm install
```

3. Create environment variables
   Create a `.env` file in the root directory with the following content:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/job_matcher
```

4. Create uploads directory

```bash
mkdir uploads
```

5. Start MongoDB (if not running as a service)

```bash
mongod
```

6. Start the server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Documentation

### Upload Resume

Upload a resume file (PDF or DOCX) and extract keywords.

- **URL**: `/api/resume/upload-resume`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Request Body**:
  - `resume`: File (PDF or DOCX)

#### Success Response

```json
{
  "message": "Resume uploaded successfully",
  "resume": {
    "id": "60f7b0b3e6b3f52a94c1e812",
    "filename": "1626789043574-resume.pdf",
    "keywords": ["javascript", "react", "node.js", "express", "mongodb"]
  }
}
```

### Search Jobs

Search for jobs based on resume keywords and location.

- **URL**: `/api/jobs/search-jobs`
- **Method**: `POST`
- **Content-Type**: `application/json`
- **Request Body**:

```json
{
  "resumeId": "60f7b0b3e6b3f52a94c1e812",
  "location": "New York, NY",
  "limit": 10
}
```

#### Success Response

```json
{
  "message": "Jobs scraped and matched successfully",
  "jobs": [
    {
      "_id": "60f7b0c3e6b3f52a94c1e815",
      "jobTitle": "Senior Frontend Developer",
      "company": "Example Corp",
      "location": "New York, NY",
      "jobLink": "https://linkedin.com/jobs/view/123456",
      "description": "We are looking for a Senior Frontend Developer with experience in React...",
      "source": "LinkedIn",
      "relevanceScore": 0.85,
      "matchedKeywords": ["javascript", "react"],
      "keywordMatchCount": 2,
      "resumeId": "60f7b0b3e6b3f52a94c1e812",
      "dateAdded": "2023-07-21T15:04:35.628Z"
    }
    // More jobs...
  ]
}
```

### Get Saved Jobs

Retrieve jobs that have been saved for a specific resume.

- **URL**: `/api/jobs/saved-jobs/:resumeId`
- **Method**: `GET`
- **URL Parameters**: `resumeId=[MongoDB ObjectId]`

#### Success Response

```json
{
  "message": "Jobs retrieved successfully",
  "resumeKeywords": ["javascript", "react", "node.js", "express", "mongodb"],
  "jobs": [
    {
      "_id": "60f7b0c3e6b3f52a94c1e815",
      "jobTitle": "Senior Frontend Developer",
      "company": "Example Corp",
      "location": "New York, NY",
      "jobLink": "https://linkedin.com/jobs/view/123456",
      "description": "We are looking for a Senior Frontend Developer with experience in React...",
      "source": "LinkedIn",
      "relevanceScore": 0.85,
      "matchedKeywords": ["javascript", "react"],
      "keywordMatchCount": 2,
      "resumeId": "60f7b0b3e6b3f52a94c1e812",
      "dateAdded": "2023-07-21T15:04:35.628Z"
    }
    // More jobs...
  ]
}
```

## How It Works

### Resume Parsing and Keyword Extraction

1. Accepts PDF or DOCX resumes via file upload
2. Extracts plain text using pdf-parse or mammoth
3. Processes text with Natural.js for keyword extraction
4. Uses TF-IDF analysis to identify important terms
5. Detects common industry skills and buzzwords
6. Stores keywords with the resume in MongoDB

### Job Scraping

1. Uses Puppeteer to navigate to LinkedIn and Indeed job search pages
2. Searches using the top resume keywords and specified location
3. Extracts job listings with Cheerio (company, title, location, link)
4. Gets full job descriptions for each listing
5. Processes approximately 25 listings from each site for optimal results

### Matching Algorithm

1. Compares resume keywords against job title and description
2. Calculates exact keyword match count
3. Performs TF-IDF similarity analysis between resume and job text
4. Combines scores with appropriate weighting
5. Ranks jobs by relevance score
6. Returns the top 10 most relevant positions

## Limitations and Considerations

- **Web Scraping**: LinkedIn and Indeed may change their site structure, breaking the scraping functionality. Always respect robots.txt and rate limits.
- **Keyword Accuracy**: The keyword extraction algorithm prioritizes technical skills and industry terms but may miss context-specific relevance.
- **Job Description Quality**: Some job listings have limited descriptions on the search page, affecting match quality.
- **Processing Time**: Scraping and matching can take 30-60 seconds depending on the number of jobs.

## Future Enhancements

- User authentication and personal job tracking
- Scheduled job searches with email notifications
- Improved NLP for context-aware keyword extraction
- Support for additional job sites (Glassdoor, ZipRecruiter, etc.)
- Machine learning for personalized job recommendations
- Resume improvement suggestions based on top job matches
- Frontend client for easier interaction

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
