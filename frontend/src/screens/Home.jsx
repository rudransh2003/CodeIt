import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../context/user.context'
import axios from "../config/axios"
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const { user, setUser } = useContext(UserContext)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [projectModal, setProjectOpen] = useState(false)
    const [projectName, setProjectName] = useState('')
    const [projectDescription, setProjectDescription] = useState('')
    const [hoveredProject, setHoveredProject] = useState(null)
    const [project, setProject] = useState([])
    const navigate = useNavigate()

    function createProject(e) {
        e.preventDefault()
        axios.post('/projects/create', {
            name: projectName,
            description: projectDescription
        })
            .then((res) => {
                setIsModalOpen(false)
                setProjectName('')
                setProjectDescription('')
                fetchProjects()
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const fetchProjects = () => {
        axios.get('/projects/all')
            .then((res) => {
                setProject(res.data.projects)
            })
            .catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        fetchProjects()
    }, [])

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token')
            await axios.post('/users/logout', {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            localStorage.removeItem('token')
            setUser(null)
            navigate('/login')
        } catch (err) {
            console.error('Logout failed:', err)
            localStorage.removeItem('token')
            setUser(null)
            navigate('/login')
        }
    }

    return (
        <main className='p-4'>
            <h1 className="flex justify-center p-10 md:text-3xl">
                Welcome {user.email}
            </h1>

            <div className="flex flex-row justify-center py-4 gap-4">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="project p-4 border border-slate-300 rounded-md hover:bg-slate-50"
                >
                    New Project
                    <i className="ri-link ml-2"></i>
                </button>
                <button
                    onClick={() => setProjectOpen(prev => !prev)}
                    className="project p-4 border border-slate-300 rounded-md hover:bg-slate-50"
                >
                    {projectModal ? "Hide Projects" : "View Projects"}
                    <i className="ri-link ml-2"></i>
                </button>
            </div>

            <div className="projects flex flex-wrap gap-3 justify-center">
                {projectModal &&
                    project.map((project) => (
                        <div
                            className="project relative flex flex-col gap-2 cursor-pointer p-4 border border-slate-300 rounded-md min-w-52 hover:bg-slate-200"
                            onMouseEnter={() => setHoveredProject(project._id)}
                            onMouseLeave={() => setHoveredProject(null)}
                            onClick={() => {
                                navigate(`/project`, { state: { project } })
                            }}
                        >
                            {/* Tooltip */}
                            {hoveredProject === project._id && (
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white border border-gray-300 rounded-md p-2 shadow-lg w-48 text-sm z-10">
                                    {project.description}
                                </div>
                            )}

                            <h2 className='font-semibold'>
                                {project.name}
                            </h2>
                            <div className="flex gap-2">
                                <p>
                                    <small><i className="ri-user-line"></i> Collaborators</small> :
                                </p>
                                {project.users.length}
                            </div>
                        </div>

                    ))
                }
                <button
                    type="button"
                    onClick={handleLogout}
                    className="text-black cursor-pointer px-4 py-1 border border-slate-300 rounded-md min-h-2 fixed top-4 right-4 hover:bg-slate-200"
                >
                    Logout
                </button>
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-md shadow-md w-1/3">
                        <h2 className="text-xl mb-4">Create New Project</h2>
                        <form onSubmit={createProject}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Project Name</label>
                                <input
                                    onChange={(e) => setProjectName(e.target.value)}
                                    value={projectName}
                                    type="text"
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <input
                                    onChange={(e) => setProjectDescription(e.target.value)}
                                    value={projectDescription}
                                    type="text"
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="mr-2 px-4 py-2 bg-gray-300 rounded-md"
                                    onClick={() => {
                                        setIsModalOpen(false)
                                        setProjectName('')
                                        setProjectDescription('')
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    )
}

export default Home