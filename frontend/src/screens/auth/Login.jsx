import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../../config/axios'
import { UserContext } from '../../context/user.context'
import { handleApiError } from '../../utils/errorHandler'
import { toast } from 'react-toastify'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { setUser } = useContext(UserContext)
    const navigate = useNavigate()

    function submitHandler(e) {
        e.preventDefault();
        axios.post('/users/login', { email, password })
            .then((res) => {
                localStorage.setItem("token", res.data.token);
                setUser(res.data.user);
                toast.success("Login successful!");
                navigate("/home");
            })
            .catch((err) => {
                handleApiError(err, "Login failed");
            });
    }

    function handleGoogleLogin() {
        const backendUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
        window.location.href = `${backendUrl}/users/google`;
    }    

    return (
        <div className="min-h-screen flex items-center justify-center bg-black">
            <div className="bg-black/80 backdrop-blur-lg p-8 rounded-xl border border-white/10 shadow-2xl w-full max-w-md">
                <h2 className="text-3xl font-extrabold text-white mb-8 text-center">
                    Welcome Back
                </h2>
                <form onSubmit={submitHandler} className="space-y-6">
                    <div>
                        <label className="block text-gray-400 mb-2" htmlFor="email">Email</label>
                        <input
                            value={email}
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
                            value={password}
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
                        Login
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
                    Don&apos;t have an account?{" "}
                    <Link to="/register" className="text-white underline hover:text-gray-300">
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login
