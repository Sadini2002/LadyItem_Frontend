import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import AdminPage from "./AdminPage";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
        {
          email,
          password,

        }
      );
      
      console.log("Login successful:", response.data);
      toast.success("Login successful!");

      localStorage.setItem("token", response.data.token);
      
        // Reload the page to update the state
    
      if (response.data.user && response.data.user.role !== "admin") {
          navigate("/"); // Redirect to home page for non-admin users
      } else {
        navigate("/admin");
      }

    } catch (error) {
      console.log ("Login error:", error);
      toast.error("Login failed. Please check your credentials.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#121212] px-4">
      {/* Background Glow */}
      <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-[#8B1A24]/30 rounded-full blur-3xl"></div>

      <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-[#FF8A75]/20 rounded-full blur-3xl"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md ">
        <div className="bg-white/5 backdrop-blur-xl border border-[#FF8A75]/20 rounded-3xl shadow-2xl p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-[#8B1A24] border-2 border-[#FF8A75] flex items-center justify-center shadow-lg">
              <img
                src="/logo.png"
                alt="logo"
                className="w-12 h-12 object-cover rounded-full"
              />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-4xl font-bold text-center text-[#FF8A75]">
            Welcome Back
          </h2>

          <p className="text-center text-gray-300 mt-2 mb-8">
            Login to continue your shopping journey
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm text-gray-300 mb-2 font-medium">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-5 py-3 rounded-xl bg-[#1C1C1C] text-white placeholder-gray-500 border border-[#8B1A24] focus:outline-none focus:ring-2 focus:ring-[#FF8A75] focus:border-[#FF8A75] transition-all duration-300"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-300 mb-2 font-medium">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-5 py-3 rounded-xl bg-[#1C1C1C] text-white placeholder-gray-500 border border-[#8B1A24] focus:outline-none focus:ring-2 focus:ring-[#FF8A75] focus:border-[#FF8A75] transition-all duration-300"
              />
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-[#FF8A75] hover:text-white hover:underline transition"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-[#8B1A24] hover:bg-[#A61F2C] text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-[#8B1A24]/40 transition-all duration-300 hover:scale-[1.02]"
            >
              Login
            </button>

            {/* Sign Up */}
            <p className="text-center text-gray-300 text-sm">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-[#FF8A75] font-semibold hover:text-white hover:underline transition"
              >
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;