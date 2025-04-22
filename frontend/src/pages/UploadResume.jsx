import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UploadResume({ setHasResume, setIsLoading, setJobs }) {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const uploadedFile = e.dataTransfer.files[0];
      if (validateFile(uploadedFile)) {
        setFile(uploadedFile);
        setError("");
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const uploadedFile = e.target.files[0];
      if (validateFile(uploadedFile)) {
        setFile(uploadedFile);
        setError("");
      }
    }
  };

  const validateFile = (file) => {
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a PDF or Word document");
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      setError("File size exceeds 5MB");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setUploadProgress(0);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/resume/upload-resume`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      if (response.status === 201) {
        setHasResume(true);
        localStorage.setItem("hasResume", "true");
        navigate("/results");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(
        err.response?.data?.message || "Upload failed. Please try again."
      );
    }
  };

  const searchJobs = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/jobs/search-jobs`
      );

      if (response.status === 200) {
        setJobs(response.data);
        localStorage.setItem("cachedJobs", JSON.stringify(response.data));
        navigate("/results");
      }
    } catch (err) {
      console.error("Job search error:", err);
      setError(
        err.response?.data?.message || "Failed to find jobs. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
        Upload Your Resume
      </h1>

      <form onSubmit={handleSubmit} className="mb-8">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="resume-upload"
            className="hidden"
            accept=".pdf,.docx"
            onChange={handleFileChange}
          />

          <label
            htmlFor="resume-upload"
            className="cursor-pointer text-blue-600 hover:text-blue-800"
          >
            <div className="flex flex-col items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mb-4 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <span className="text-lg font-medium">
                Click to upload or drag and drop
              </span>
              <span className="text-sm text-gray-500 mt-1">
                PDF or Word documents only (max. 5MB)
              </span>
            </div>
          </label>

          {file && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg flex items-center justify-between">
              <span className="text-sm font-medium truncate max-w-xs">
                {file.name}
              </span>
              <button
                type="button"
                className="text-red-500 hover:text-red-700"
                onClick={() => setFile(null)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1 text-right">
              {uploadProgress}%
            </p>
          </div>
        )}

        {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}

        <div className="mt-6">
          <button
            type="submit"
            className="cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
            disabled={!file}
          >
            Upload Resume
          </button>
        </div>
      </form>

      {localStorage.getItem("hasResume") === "true" && (
        <div className="text-center">
          <button
            onClick={searchJobs}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
          >
            Find Jobs Based on My Resume
          </button>
        </div>
      )}
    </div>
  );
}

export default UploadResume;
