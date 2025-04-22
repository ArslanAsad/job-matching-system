import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold">
            JobMatchr
          </Link>
          <div className="space-x-4">
            <Link to="/" className="hover:text-blue-200">
              Home
            </Link>
            <Link to="/upload" className="hover:text-blue-200">
              Upload Resume
            </Link>
            <Link to="/results" className="hover:text-blue-200">
              Job Results
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
