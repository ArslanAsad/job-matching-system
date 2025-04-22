import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">
        Welcome to JobMatchr
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl text-center mb-8">
        Upload your resume and let our AI-powered system find the perfect job
        matches for you from Indeed and LinkedIn.
      </p>
      <Link
        to="/upload"
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg 
        transition duration-200 shadow-md"
      >
        Get Started
      </Link>
    </div>
  );
}

export default Home;
