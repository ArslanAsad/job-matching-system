import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import UploadResume from "./pages/UploadResume";
import JobResults from "./pages/JobResults";
import Navbar from "./components/Navbar";

function App() {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasResume, setHasResume] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/upload"
              element={
                <UploadResume
                  setHasResume={setHasResume}
                  setIsLoading={setIsLoading}
                  setJobs={setJobs}
                />
              }
            />
            <Route
              path="/results"
              element={
                <JobResults
                  jobs={jobs}
                  isLoading={isLoading}
                  hasResume={hasResume}
                  setIsLoading={setIsLoading}
                  setJobs={setJobs}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
