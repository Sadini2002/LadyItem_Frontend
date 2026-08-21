import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
        {
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }
      );

      console.log("Signup successful:", response.data);

      toast.success("Account created successfully!");

      navigate("/products");
    } catch (error) {
      console.error("Signup error:", error);

      toast.error(
        error.response?.data?.message || "Signup failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] relative overflow-hidden px-4 py-10">
      {/* Background Glow */}
      <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-[#8B1A24]/30 rounded-full blur-3xl"></div>

      <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-[#FF8A75]/20 rounded-full blur-3xl"></div>

      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-lg bg-white/5 backdrop-blur-xl border border-[#FF8A75]/20 rounded-3xl shadow-2xl p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-[#8B1A24] flex items-center justify-center border-2 border-[#FF8A75] shadow-lg">
            <img
              src="/logo.png"
              alt="Logo"
              className="w-12 h-12 rounded-full object-cover"
            />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-4xl font-bold text-center text-[#FF8A75]">
          Create Account
        </h2>

        <p className="text-center text-gray-300 mt-2 mb-8">
          Join with us and start shopping today
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* First & Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 mb-2 text-sm">
                First Name
              </label>

              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                placeholder="First name"
                required
                className="w-full px-4 py-3 rounded-xl bg-[#1C1C1C] text-white placeholder-gray-500 border border-[#8B1A24] focus:outline-none focus:ring-2 focus:ring-[#FF8A75] focus:border-[#FF8A75] transition-all"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 text-sm">
                Last Name
              </label>

              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                placeholder="Last name"
                required
                className="w-full px-4 py-3 rounded-xl bg-[#1C1C1C] text-white placeholder-gray-500 border border-[#8B1A24] focus:outline-none focus:ring-2 focus:ring-[#FF8A75] focus:border-[#FF8A75] transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 rounded-xl bg-[#1C1C1C] text-white placeholder-gray-500 border border-[#8B1A24] focus:outline-none focus:ring-2 focus:ring-[#FF8A75] focus:border-[#FF8A75] transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create password"
              required
              className="w-full px-4 py-3 rounded-xl bg-[#1C1C1C] text-white placeholder-gray-500 border border-[#8B1A24] focus:outline-none focus:ring-2 focus:ring-[#FF8A75] focus:border-[#FF8A75] transition-all"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              required
              className="w-full px-4 py-3 rounded-xl bg-[#1C1C1C] text-white placeholder-gray-500 border border-[#8B1A24] focus:outline-none focus:ring-2 focus:ring-[#FF8A75] focus:border-[#FF8A75] transition-all"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-gray-300 mb-2 text-sm">Role</label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-[#1C1C1C] text-white border border-[#8B1A24] focus:outline-none focus:ring-2 focus:ring-[#FF8A75] focus:border-[#FF8A75] transition-all"
            >
              <option value="user" className="text-black">
                User
              </option>

              <option value="admin" className="text-black">
                Admin
              </option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#8B1A24] hover:bg-[#A61F2C] text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-lg hover:scale-[1.02]"
          >
            Create Account
          </button>
        </form>

        {/* Login Link */}
        <p className="text-gray-300 text-center mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#FF8A75] font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;