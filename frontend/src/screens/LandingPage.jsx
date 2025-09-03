import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-6 bg-black/80 backdrop-blur-md text-white shadow-lg">
        <h1 className="text-2xl font-extrabold tracking-wide">Code-it</h1>
        <div className="space-x-6">
          <Link to="/login">
            <button className="px-5 py-2 rounded-lg border border-white/30 text-white font-medium hover:bg-white hover:text-black transition">
              Login
            </button>
          </Link>
          <Link to="/register">
            <button className="px-5 py-2 rounded-lg bg-white text-black font-medium hover:bg-gray-200 transition">
              Register
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col md:flex-row items-center justify-center flex-1 px-6 text-center md:text-left">
        {/* Left Side: Text */}
        <div className="max-w-xl">
          <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Empower your team with <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">AI-driven coding</span>!
          </h2>
          <p className="text-lg text-gray-400 mb-10">
            Enhance productivity with our collaborative tools and smarter workflows.
          </p>
          <div className="flex space-x-6 justify-center md:justify-start">
            <Link to="/login">
              <button className="px-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition shadow-lg">
                Get Started
              </button>
            </Link>
            <Link to="/register">
              <button className="px-6 py-3 rounded-lg border border-white/30 text-white font-semibold hover:bg-white hover:text-black transition">
                Register
              </button>
            </Link>
          </div>
        </div>

        {/* Right Side: Icon */}
        <div className="mt-10 md:mt-0 md:ml-20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-48 w-48 text-gray-500 opacity-70"
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
      <footer className="bg-black text-gray-500 py-6 text-center border-t border-white/10">
        <p>© 2025 Code-it. All rights reserved.</p>
      </footer>
    </div>
  );
}