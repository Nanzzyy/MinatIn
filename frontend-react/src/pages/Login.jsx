import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const formData = new FormData();
            formData.append("username", username);
            formData.append("password", password);

            const response = await fetch("http://127.0.0.1:5000/login", {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            if (response.ok) {
                // If login successful, redirect using React Router
                navigate("/dashboard");
            } else {
                const data = await response.json();
                setError(data.error || "Login failed");
            }
        } catch (err) {
            setError("Could not connect to server. Make sure backend is running.");
            console.error(err);
        }
    };

    return (
        <div>
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="w-full max-w-md">
                    <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Login</h1>
                    <form className="bg-white shadow-xl rounded-lg px-10 pt-8 pb-10 mb-4 border border-gray-200" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-center text-sm">
                                {error}
                            </div>
                        )}
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                                Username
                            </label>
                            <input
                                className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                id="username"
                                type="text"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-8">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex items-center justify-center">
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full focus:outline-none focus:shadow-outline transform transition hover:scale-105 active:scale-95 w-full shadow-lg"
                                type="submit"
                            >
                                Sign In
                            </button>
                        </div>
                    </form>
                    <p className="text-center text-gray-500 text-xs">
                        &copy;2026 MinatIn. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
