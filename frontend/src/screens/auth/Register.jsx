import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../../context/user.context'
import axios from '../../config/axios'
import { toast } from "react-toastify"
import { handleApiError } from '../../utils/errorHandler'

const Register = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { setUser } = useContext(UserContext)
    const navigate = useNavigate()

    function submitHandler(e) {
        e.preventDefault()
        axios.post(`${import.meta.env.VITE_API_BASE_URL}/users/register`, {
            email,
            password,
        })
            .then((res) => {
                localStorage.setItem('token', res.data.token)
                setUser(res.data.user)
                toast.success("User Registered successfully!")
                navigate('/login')
            })
            .catch((err) => handleApiError(err, "Registration failed!"))
    }

    function handleGoogleLogin() {
        window.location.href = `${import.meta.env.VITE_API_BASE_URL}/users/google`
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="bg-black/80 backdrop-blur-lg p-8 rounded-xl border border-white/10 shadow-2xl w-full max-w-md">
                <h2 className="text-3xl font-extrabold text-white mb-8 text-center">
                    Create Your Account
                </h2>
                <form onSubmit={submitHandler} className="space-y-6">
                    <div>
                        <label className="block text-gray-400 mb-2" htmlFor="email">Email</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            id="email"
                            className="w-full p-3 rounded-lg bg-black border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 mb-2" htmlFor="password">Password</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            id="password"
                            className="w-full p-3 rounded-lg bg-black border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full p-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition shadow-md"
                    >
                        Register
                    </button>
                </form>
{/*                 <div className="flex items-center justify-center my-6">
                    <span className="text-gray-500 text-sm">OR</span>
                </div>
                <button
                    onClick={handleGoogleLogin}
                    className="w-full p-3 rounded-lg border border-white/30 text-white font-medium hover:bg-white hover:text-black transition"
                >
                    Continue with Google
                </button> */}
                <p className="text-gray-400 mt-6 text-center">
                    Already have an account?{" "}
                    <Link to="/login" className="text-white underline hover:text-gray-300">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Register
