import { useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import JobCard from "../components/JobCard";
import LoadingSpinner from "../components/LoadingSpinner";

function JobResults({ jobs, isLoading, hasResume, setIsLoading, setJobs }) {
  useEffect(() => {
    // Check localStorage for cached jobs
    const cachedJobs = localStorage.getItem("cachedJobs");
    if (cachedJobs && jobs.length === 0) {
      setJobs(JSON.parse(cachedJobs));
    }
  }, [jobs.length, setJobs]);

  const searchJobs = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/jobs/search-jobs`
      );

      if (response.status === 200) {
        setJobs(response.data);
        localStorage.setItem("cachedJobs", JSON.stringify(response.data));
      }
    } catch (err) {
      console.error("Job search error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setJobs([]);
    localStorage.removeItem("cachedJobs");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <LoadingSpinner />
        <p className="mt-4 text-lg text-gray-600">
          Searching for the perfect jobs...
        </p>
      </div>
    );
  }

  if (!hasResume && !localStorage.getItem("hasResume")) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          No Resume Found
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          Please upload your resume first to find matching jobs.
        </p>
        <Link
          to="/upload"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200"
        >
          Upload Resume
        </Link>
      </div>
    );
  }

  if (jobs.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">No Jobs Found</h2>
        <p className="text-lg text-gray-600 mb-6">
          We couldn't find any jobs matching your resume. Try searching again or
          upload a different resume.
        </p>
        <button
          onClick={searchJobs}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition duration-200 mb-4"
        >
          Search Again
        </button>
        <Link
          to="/upload"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Upload Different Resume
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600">Matched Jobs</h1>
        <div className="space-x-4">
          <button
            onClick={searchJobs}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            Refresh Results
          </button>
          <button
            onClick={clearResults}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition duration-200"
          >
            Clear Results
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job, index) => (
          <JobCard key={job._id || index} job={job} />
        ))}
      </div>
    </div>
  );
}

export default JobResults;
