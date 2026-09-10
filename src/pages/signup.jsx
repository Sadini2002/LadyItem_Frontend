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

  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 1️⃣ Send OTP for Signup
  const handleSendSignupOtp = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/send-otp`,
        {
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          isSignup: true,
        }
      );

      toast.success(response.data.message || "OTP code sent to your Gmail!");
      setIsOtpSent(true);
    } catch (error) {
      console.error("Signup OTP error:", error);
      toast.error(
        error.response?.data?.message || "Failed to send verification code. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // 2️⃣ Verify OTP & Create Account
  const handleVerifySignupOtp = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error("Please enter the 6-digit OTP code sent to your email.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/verify-otp`,
        {
          email: formData.email,
          otp: otp,
        }
      );

      toast.success("Account created & verified successfully!");

      const role = response.data.role || formData.role || "user";
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", role);
      }

      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/products");
      }
    } catch (error) {
      console.error("Verify OTP error:", error);
      toast.error(
        error.response?.data?.message || "Invalid or expired OTP code."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] relative overflow-hidden px-4 py-10">
      {/* Background Glow */}
      <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-[#8B1A24]/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-[#FF8A75]/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Signup Card */}
      <div className="relative z-10 w-full max-w-lg bg-white/5 backdrop-blur-xl border border-[#FF8A75]/20 rounded-3xl shadow-2xl p-8">
        
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-[#8B1A24] flex items-center justify-center border-2 border-[#FF8A75] shadow-lg">
            <img
              src="src\assents\logo.png"
              alt="Logo"
              className="w-20 h-20 object-cover rounded-full"
            />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-3xl font-bold text-center text-[#FF8A75]">
          {isOtpSent ? "Verify Email Address" : "Create Account"}
        </h2>

        <p className="text-center text-gray-300 mt-2 mb-8 text-sm">
          {isOtpSent
            ? `We sent a 6-digit OTP code to ${formData.email}`
            : "Join us and start shopping today"}
        </p>

        {/* ── STEP 2: VERIFY OTP ── */}
        {isOtpSent ? (
          <form onSubmit={handleVerifySignupOtp} className="space-y-6">
            <div>
              <label className="block text-xs text-gray-300 mb-2 font-medium text-center">
                6-Digit OTP Code
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="• • • • • •"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                required
                className="w-full px-5 py-3 rounded-xl bg-[#1C1C1C] text-white text-center text-2xl tracking-[0.5em] font-mono border border-[#FF8A75] focus:outline-none focus:ring-2 focus:ring-[#FF8A75] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8B1A24] hover:bg-[#A61F2C] text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-lg hover:scale-[1.02] disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Verifying OTP...
                </>
              ) : (
                "Verify OTP & Complete Signup"
              )}
            </button>

            {/* Resend & Back controls */}
            <div className="flex justify-between items-center text-xs pt-2">
              <button
                type="button"
                onClick={handleSendSignupOtp}
                disabled={loading}
                className="text-[#FF8A75] hover:underline"
              >
                Resend OTP Code
              </button>
              <button
                type="button"
                onClick={() => setIsOtpSent(false)}
                className="text-gray-400 hover:text-white transition"
              >
                Edit Account Info
              </button>
            </div>
          </form>
        ) : (
          /* ── STEP 1: ACCOUNT DETAILS ── */
          <form onSubmit={handleSendSignupOtp} className="space-y-5">
            {/* First & Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2 text-xs font-medium">
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
                <label className="block text-gray-300 mb-2 text-xs font-medium">
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
              <label className="block text-gray-300 mb-2 text-xs font-medium">
                Email Address (Gmail)
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="yourname@gmail.com"
                required
                className="w-full px-4 py-3 rounded-xl bg-[#1C1C1C] text-white placeholder-gray-500 border border-[#8B1A24] focus:outline-none focus:ring-2 focus:ring-[#FF8A75] focus:border-[#FF8A75] transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-300 mb-2 text-xs font-medium">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create password (min 6 chars)"
                required
                className="w-full px-4 py-3 rounded-xl bg-[#1C1C1C] text-white placeholder-gray-500 border border-[#8B1A24] focus:outline-none focus:ring-2 focus:ring-[#FF8A75] focus:border-[#FF8A75] transition-all"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-300 mb-2 text-xs font-medium">
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
              <label className="block text-gray-300 mb-2 text-xs font-medium">
                Role
              </label>
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
              disabled={loading}
              className="w-full bg-[#8B1A24] hover:bg-[#A61F2C] text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-lg hover:scale-[1.02] disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending OTP Code...
                </>
              ) : (
                "Send Verification Code to Gmail"
              )}
            </button>
          </form>
        )}

        {/* Login Link */}
        <p className="text-gray-300 text-center mt-6 text-sm">
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