const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

// Scrape linkedin jobs
const scrapeLinkedInJobs = async (keywords, location) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // combine keywords for search query
  const keywordQuery = keywords.slice(0, 5).join(" ");

  // format search URL
  const searchUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(
    keywordQuery
  )}&location=${encodeURIComponent(location)}&f_TPR=r86400`;

  console.log(`Scraping LinkedIn jobs for: ${keywordQuery} in ${location}`);

  try {
    await page.goto(searchUrl, { waitUntil: "networkidle2" });

    // wait for job listings to load
    await page.waitForSelector(".jobs-search__results-list", {
      timeout: 10000,
    });

    // scroll to load more jobs
    await autoScroll(page);

    // get page content
    const content = await page.content();
    const $ = cheerio.load(content);

    const jobs = [];

    // extract job info
    $(".jobs-search__results-list li").each((i, el) => {
      if (i >= 25) return; // limit to 25 jobs per site
      const jobTitle = $(el).find(".base-search-card__title").text().trim();
      const company = $(el).find(".base-search-card__subtitle").text().trim();
      const location = $(el).find(".job-search-card__location").text().trim();
      const jobLink = $(el).find("a.base-card__full-link").attr("href");
      const postedDate = $(el).find(".job-search-card__listdate").text().trim();
      if (jobTitle && company) {
        jobs.push({
          jobTitle,
          company,
          location,
          jobLink,
          postedDate,
          source: "LinkedIn",
          description: "", // Will be populated when needed
        });
      }
    });
    console.log(`Found ${jobs.length} jobs on LinkedIn`);
    return jobs;
  } catch (error) {
    console.error("Error scraping LinkedIn jobs:", error);
    return [];
  } finally {
    await browser.close();
  }
};

// Scrape Indeed jobs
const scrapeIndeedJobs = async (keywords, location) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // combine keywords for search query
  const keywordQuery = keywords.slice(0, 5).join(" ");

  // format search URL
  const searchUrl = `https://www.indeed.com/jobs?q=${encodeURIComponent(
    keywordQuery
  )}&l=${encodeURIComponent(location)}&fromage=1`;

  console.log(`Scraping Indeed jobs for: ${keywordQuery} in ${location}`);

  try {
    await page.goto(searchUrl, { waitUntil: "networkidle2" });

    // wait for job listings to load
    await page.waitForSelector(".jobsearch-ResultsList", { timeout: 10000 });

    // scroll to load more jobs
    await autoScroll(page);

    // get page content
    const content = await page.content();
    const $ = cheerio.load(content);

    const jobs = [];

    // extract job info
    $(".jobsearch-ResultsList .result").each((i, el) => {
      if (i >= 25) return; // Limit to 25 jobs per site
      const jobTitle = $(el).find(".jobTitle span").text().trim();
      const company = $(el).find(".companyName").text().trim();
      const location = $(el).find(".companyLocation").text().trim();
      // get job link
      const jobCardLink = $(el).find(".jcs-JobTitle").attr("href");
      const jobLink = jobCardLink ? `https://www.indeed.com${jobCardLink}` : "";
      // get summary
      const summary = $(el).find(".job-snippet").text().trim();
      if (jobTitle && company) {
        jobs.push({
          jobTitle,
          company,
          location,
          jobLink,
          summary,
          source: "Indeed",
          description: "", // Will be populated when needed
        });
      }
    });
    console.log(`Found ${jobs.length} jobs on Indeed`);
    return jobs;
  } catch (error) {
    console.error("Error scraping Indeed jobs:", error);
    return [];
  } finally {
    await browser.close();
  }
};

// Get full description for a specific job
const getJobDescription = async (job) => {
  // skip if already has description
  if (job.description && job.description.length > 0) {
    return job;
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  try {
    await page.goto(job.jobLink, { waitUntil: "networkidle2", timeout: 30000 });

    let description = "";

    if (job.source === "LinkedIn") {
      // wait for LinkedIn job description
      await page.waitForSelector(".show-more-less-html", { timeout: 10000 });
      description = await page.$eval(
        ".show-more-less-html",
        (el) => el.innerText
      );
    } else if (job.source === "Indeed") {
      // wait for Indeed job description
      await page.waitForSelector("#jobDescriptionText", { timeout: 10000 });
      description = await page.$eval(
        "#jobDescriptionText",
        (el) => el.innerText
      );
    }

    return {
      ...job,
      description: description.trim(),
    };
  } catch (error) {
    console.error(`Error getting job description for ${job.jobTitle}:`, error);
    return job;
  } finally {
    await browser.close();
  }
};

// Helper function to auto scroll
const autoScroll = async (page) => {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight || totalHeight > 5000) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
};

// Main funcion to scrape jobs from LinkedIn and Indeed
exports.scrapeJobs = async (keywords, location) => {
  try {
    // run job scraping
    const [linkedInJobs, indeedJobs] = await Promise.all([
      scrapeLinkedInJobs(keywords, location),
      scrapeIndeedJobs(keywords, location),
    ]);

    // job results
    const allJobs = [...linkedInJobs, ...indeedJobs];

    // get job descriptions for top 20 jobs
    const topJobs = allJobs.slice(0, 20);
    const jobsWithDescriptions = await Promise.all(
      topJobs.map((job) => getJobDescription(job))
    );
    return jobsWithDescriptions;
  } catch (error) {
    console.error("Error scraping jobs:", error);
    throw error;
  }
};
