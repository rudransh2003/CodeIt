import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 md:px-10 py-6 bg-black/80 backdrop-blur-md text-white shadow-lg">
        <h1 className="text-xl md:text-2xl font-extrabold tracking-wide">Code-it</h1>
        <div className="space-x-4 md:space-x-6 flex">
          <Link to="/login">
            <button className="px-4 md:px-5 py-2 rounded-lg border border-white/30 text-white font-medium hover:bg-white hover:text-black transition w-full md:w-auto">
              Login
            </button>
          </Link>
          <Link to="/register">
            <button className="px-4 md:px-5 py-2 rounded-lg bg-white text-black font-medium hover:bg-gray-200 transition w-full md:w-auto">
              Register
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col md:flex-row items-center justify-center flex-1 px-6 md:px-12 py-10 text-center md:text-left gap-10">
        {/* Left Side: Text */}
        <div className="max-w-xl">
          <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Empower your team with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              AI-driven coding
            </span>
            !
          </h2>
          <p className="text-base md:text-lg text-gray-400 mb-8 md:mb-10 px-2 md:px-0">
            Enhance productivity with our collaborative tools and smarter workflows.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link to="/login">
              <button className="px-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition shadow-lg w-full sm:w-auto">
                Get Started
              </button>
            </Link>
            <Link to="/register">
              <button className="px-6 py-3 rounded-lg border border-white/30 text-white font-semibold hover:bg-white hover:text-black transition w-full sm:w-auto">
                Register
              </button>
            </Link>
          </div>
        </div>

        {/* Right Side: Icon */}
        <div className="mt-10 md:mt-0 md:ml-10 flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-32 w-32 md:h-48 md:w-48 text-gray-500 opacity-70"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 20h5v-2a4 4 0 00-3-3.87M9 20h6m-7.5-3a4.5 4.5 0 019 0m-9 0a4.5 4.5 0 01-9 0m18 0a4.5 4.5 0 019 0m-9-9a4.5 4.5 0 019 0m-18 0a4.5 4.5 0 019 0"
            />
          </svg>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-gray-500 py-6 text-center border-t border-white/10 text-sm md:text-base">
        <p>© 2025 Code-it. All rights reserved.</p>
      </footer>
    </div>
  );
}