import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/user.context";
import axios from "../config/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { handleApiError } from "../utils/errorHandler";

const Home = () => {
  const { user, setUser } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectModal, setProjectOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [hoveredProject, setHoveredProject] = useState(null);
  const [project, setProject] = useState([]);
  const navigate = useNavigate();

  function createProject(e) {
    e.preventDefault();
    axios
      .post("/projects/create", {
        name: projectName,
        description: projectDescription,
      })
      .then(() => {
        setIsModalOpen(false);
        setProjectName("");
        setProjectDescription("");
        fetchProjects();
        toast.success("Project created successfully!");
      })
      .catch((err) => handleApiError(err, "Project not created!"));
  }

  const fetchProjects = () => {
    axios
      .get("/projects/all")
      .then((res) => {
        setProject(res.data.projects);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "/users/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.removeItem("token");
      setUser(null);
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      localStorage.removeItem("token");
      setUser(null);
      navigate("/login");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white relative">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center gap-4 px-4 sm:px-6 py-4 border-b border-white/10">
        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-center sm:text-left">
          Welcome, <span className="text-gray-300">{user?.email}</span>
        </h1>
        <button
          type="button"
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white hover:text-black transition w-full sm:w-auto"
        >
          Logout
        </button>
      </header>

      {/* Get Started Section */}
      <section className="mt-10 sm:mt-12 px-4 sm:px-6 text-center max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          Get Started with Your Workspace
        </h2>
        <p className="text-gray-400 text-base sm:text-lg mb-8 sm:mb-10 px-2 sm:px-0">
          Organize your ideas, work with your team, and boost productivity using
          AI-powered prompts. Here’s how to get going:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-black/70 border border-white/10 p-6 rounded-xl shadow-md hover:bg-white/5 transition">
            <i className="ri-folder-add-line text-3xl mb-3 text-white"></i>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">
              Create Projects
            </h3>
            <p className="text-gray-400 text-sm">
              Start by creating a new project to organize your work in one
              place.
            </p>
          </div>
          <div className="bg-black/70 border border-white/10 p-6 rounded-xl shadow-md hover:bg-white/5 transition">
            <i className="ri-team-line text-3xl mb-3 text-white"></i>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">
              Collaborate
            </h3>
            <p className="text-gray-400 text-sm">
              Invite your team members and collaborate in real time on shared
              projects.
            </p>
          </div>
          <div className="bg-black/70 border border-white/10 p-6 rounded-xl shadow-md hover:bg-white/5 transition">
            <i className="ri-robot-line text-3xl mb-3 text-white"></i>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">
              Write AI Prompts
            </h3>
            <p className="text-gray-400 text-sm">
              Use AI to brainstorm ideas, generate content, and automate
              repetitive tasks.
            </p>
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10 sm:mt-12 px-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition shadow-md w-full sm:w-auto"
        >
          + New Project
        </button>
        <button
          onClick={() => setProjectOpen((prev) => !prev)}
          className="px-6 py-3 rounded-lg border border-white/20 hover:bg-white hover:text-black transition w-full sm:w-auto"
        >
          {projectModal ? "Hide Projects" : "View Projects"}
        </button>
      </div>

      {/* Project List */}
      {projectModal && (
        <section className="mt-8 sm:mt-10 px-4 sm:px-6 flex flex-wrap gap-6 justify-center">
          {project.length === 0 ? (
            <p className="text-gray-400 text-center">
              No projects available. Create one to get started.
            </p>
          ) : (
            project.map((p) => (
              <div
                key={p._id}
                className="relative bg-black/70 border border-white/10 rounded-xl p-6 w-full sm:w-64 shadow-lg cursor-pointer hover:bg-white/10 transition"
                onMouseEnter={() => setHoveredProject(p._id)}
                onMouseLeave={() => setHoveredProject(null)}
                onClick={() => {
                  navigate(`/project`, { state: { project: p } });
                }}
              >
                {/* Tooltip */}
                {hoveredProject === p._id && (
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-black border border-white/20 rounded-md p-3 shadow-lg w-56 text-sm z-10 hidden sm:block">
                    {p.description || "No description available"}
                  </div>
                )}

                <h2 className="font-bold text-base sm:text-lg">{p.name}</h2>
                <p className="text-gray-400 text-sm mt-2">
                  <i className="ri-user-line"></i> Collaborators:{" "}
                  {p.users?.length || 0}
                </p>
              </div>
            ))
          )}
        </section>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 px-4">
          <div className="bg-black/90 border border-white/10 rounded-xl p-6 sm:p-8 w-full max-w-lg shadow-2xl">
            <h2 className="text-xl sm:text-2xl font-bold mb-6">
              Create New Project
            </h2>
            <form onSubmit={createProject} className="space-y-6">
              <div>
                <label className="block text-gray-400 mb-2">Project Name</label>
                <input
                  onChange={(e) => setProjectName(e.target.value)}
                  value={projectName}
                  type="text"
                  className="w-full p-3 rounded-lg bg-black border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-400 mb-2">Description</label>
                <textarea
                  onChange={(e) => setProjectDescription(e.target.value)}
                  value={projectDescription}
                  className="w-full p-3 rounded-lg bg-black border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white text-sm sm:text-base"
                  rows="3"
                  required
                ></textarea>
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setProjectName("");
                    setProjectDescription("");
                  }}
                  className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white hover:text-black transition w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition w-full sm:w-auto"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;