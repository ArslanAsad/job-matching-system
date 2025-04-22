function JobCard({ job }) {
  const {
    title,
    company,
    location,
    description,
    salary,
    url,
    source,
    datePosted,
    matchScore,
  } = job;

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition duration-200">
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span
            className={`px-2 py-1 text-xs font-semibold rounded ${
              source === "LinkedIn"
                ? "bg-blue-100 text-blue-800"
                : source === "Indeed"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {source}
          </span>
          {matchScore && (
            <span className="text-sm font-medium text-blue-600">
              {Math.round(matchScore * 100)}% Match
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>

        <div className="flex items-center text-gray-600 mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <span className="text-sm">{company}</span>
        </div>

        <div className="flex items-center text-gray-600 mb-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="text-sm">{location}</span>
        </div>

        {salary && (
          <div className="flex items-center text-gray-600 mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm">{salary}</span>
          </div>
        )}

        <div className="mb-4">
          <p className="text-sm text-gray-600 line-clamp-3">{description}</p>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span>Posted: {formatDate(datePosted)}</span>
        </div>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-medium py-2 rounded transition duration-200"
        >
          View Job
        </a>
      </div>
    </div>
  );
}

export default JobCard;
