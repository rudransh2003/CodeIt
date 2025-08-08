import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../context/user.context'
import axios from "../config/axios"
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const { user, setUser } = useContext(UserContext) // Extract setUser here
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [projectName, setProjectName] = useState('')
    const [project, setProject] = useState([])
    const navigate = useNavigate()

    function createProject(e) {
        e.preventDefault()
        console.log({ projectName })
        axios.post('/projects/create', {
            name: projectName,
        })
            .then((res) => {
                console.log(res)
                setIsModalOpen(false)
                setProjectName('') // Clear the form
                // Refresh projects list
                fetchProjects()
            })
            .catch((error) => {
                console.log(error)
            })
    }

    // Separate function to fetch projects for reusability
    const fetchProjects = () => {
        axios.get('/projects/all').then((res) => {
            setProject(res.data.projects)
        }).catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        fetchProjects()
    }, [])

    // Fixed logout function
    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('token')
            await axios.post('/users/logout', {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            // Clear token from localStorage
            localStorage.removeItem('token')

            // Update user context
            setUser(null)

            // Navigate to login page
            navigate('/login')

        } catch (err) {
            console.error('Logout failed:', err)

            // Even if API call fails, clear local storage and navigate
            // This ensures user can't stay logged in with invalid token
            localStorage.removeItem('token')
            setUser(null)
            navigate('/login')
        }
    }

    return (
        <main className='p-4'>
            <div className="projects flex flex-wrap gap-3">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="project p-4 border border-slate-300 rounded-md hover:bg-slate-50">
                    New Project
                    <i className="ri-link ml-2"></i>
                </button>
                {
                    project.map((project) => (
                        <div key={project._id}
                            onClick={() => {
                                navigate(`/project`, {
                                    state: { project }
                                })
                            }}
                            className="project flex flex-col gap-2 cursor-pointer p-4 border border-slate-300 rounded-md min-w-52 hover:bg-slate-200">
                            <h2 className='font-semibold'>
                                {project.name}
                            </h2>

                            <div className="flex gap-2">
                                <p> <small> <i className="ri-user-line"></i> Collaborators</small> :</p>
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
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="mr-2 px-4 py-2 bg-gray-300 rounded-md"
                                    onClick={() => {
                                        setIsModalOpen(false)
                                        setProjectName('') // Clear form when canceling
                                    }}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
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