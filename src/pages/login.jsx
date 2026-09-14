import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import logo from "../assents/logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  
  // UI Control States
  const [useOtpLogin, setUseOtpLogin] = useState(true); // Default to OTP login
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Helper to handle login success
  const handleLoginSuccess = (data) => {
    toast.success("Login successful!");
    const role = data.role || "user";
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", role);

    if (role === "admin") {
      navigate("/admin");
    } else {
      navigate("/products");
    }
  };

  // 1️⃣ Send OTP to Email
  async function handleSendOtp(e) {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/send-otp`,
        { email }
      );
      toast.success(response.data.message || "OTP code sent to your Gmail!");
      setIsOtpSent(true);
    } catch (error) {
      console.error("Send OTP error:", error);
      toast.error(
        error.response?.data?.message || "Failed to send OTP. Check your email."
      );
    } finally {
      setLoading(false);
    }
  }

  // 2️⃣ Verify OTP & Complete Login
  async function handleVerifyOtp(e) {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP code");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/verify-otp`,
        { email, otp }
      );

      handleLoginSuccess(response.data);
    } catch (error) {
      console.error("Verify OTP error:", error);
      toast.error(
        error.response?.data?.message || "Invalid or expired OTP code"
      );
    } finally {
      setLoading(false);
    }
  }

  // 3️⃣ Normal Password Login
  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
        { email, password }
      );

      handleLoginSuccess(response.data);
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.message || "Login failed. Check your credentials."
      );
    } finally {
      setLoading(false);
    }
  }

  // 4️⃣ Google Login
  async function handleGoogleLogin(response) {
    try {
      const result = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/login/google`,
        { credential: response.credential }
      );

      handleLoginSuccess(result.data);
    } catch (error) {
      console.error("Google login error:", error);
      toast.error(
        error.response?.data?.message || "Google login failed"
      );
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#0D0B0E] via-[#1A0E13] to-[#0D0B0E] px-4 py-12">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-[#8B1A24]/30 to-[#FF8A75]/20 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-[#8B1A24]/20 to-[#FF8A75]/30 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-[#161316]/70 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] p-8">
          
          {/* Logo with explicit styling */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#8B1A24] to-[#FF8A75] flex items-center justify-center shadow-lg shadow-[#8B1A24]/20 transition-transform duration-300 hover:scale-105 p-0.5">
              <img
                src={logo}
                alt="Lady item logo"
                className="w-full h-full object-cover rounded-[14px]"
              />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-white via-[#FF8A75] to-[#FF8A75] bg-clip-text text-transparent">
            {isOtpSent ? "Enter Verification Code" : "Welcome Back"}
          </h2>

          <p className="text-center text-gray-300 mt-2 mb-6 text-sm">
            {isOtpSent
              ? `We've sent a 6-digit code to ${email}`
              : useOtpLogin
              ? "Sign in with your Gmail OTP code"
              : "Login with your email and password"}
          </p>

          {/* Tab Switcher */}
          {!isOtpSent && (
            <div className="flex rounded-xl bg-[#0D0B0E]/80 p-1 mb-6 border border-white/10">
              <button
                type="button"
                onClick={() => setUseOtpLogin(true)}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  useOtpLogin
                    ? "bg-gradient-to-tr from-[#8B1A24] to-[#FF8A75] text-white shadow-md shadow-[#8B1A24]/20"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                📧 OTP Code
              </button>
              <button
                type="button"
                onClick={() => setUseOtpLogin(false)}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  !useOtpLogin
                    ? "bg-gradient-to-tr from-[#8B1A24] to-[#FF8A75] text-white shadow-md shadow-[#8B1A24]/20"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                🔒 Password
              </button>
            </div>
          )}

          {/* ── OTP STEP 2: VERIFY OTP ── */}
          {isOtpSent ? (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
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
                  className="w-full px-5 py-3 rounded-xl bg-[#0D0B0E]/60 text-white text-center text-2xl tracking-[0.5em] font-mono border border-[#FF8A75]/40 focus:outline-none focus:ring-2 focus:ring-[#FF8A75] transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-tr from-[#8B1A24] to-[#FF8A75] hover:opacity-95 text-white font-semibold py-3 rounded-xl shadow-lg shadow-[#8B1A24]/30 transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Verifying OTP...
                  </>
                ) : (
                  "Verify & Login"
                )}
              </button>

              <div className="flex justify-between items-center text-xs pt-2">
                <button
                  type="button"
                  onClick={handleSendOtp}
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
                  Change Email
                </button>
              </div>
            </form>
          ) : useOtpLogin ? (
            /* ── OTP STEP 1: ENTER EMAIL ── */
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label className="block text-sm text-gray-300 mb-2 font-medium">
                  Gmail Address
                </label>
                <input
                  type="email"
                  placeholder="yourname@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-5 py-3 rounded-xl bg-[#0D0B0E]/60 text-white placeholder-gray-500 border border-[#8B1A24]/60 focus:outline-none focus:ring-2 focus:ring-[#FF8A75] focus:border-[#FF8A75] transition-all duration-300"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-tr from-[#8B1A24] to-[#FF8A75] hover:opacity-95 text-white font-semibold py-3 rounded-xl shadow-lg shadow-[#8B1A24]/30 transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending OTP to Gmail...
                  </>
                ) : (
                  "Send OTP Code to Email"
                )}
              </button>

              <div className="relative my-4 flex items-center justify-center">
                <div className="border-t border-white/10 w-full"></div>
                <span className="bg-[#120F12] px-3 text-xs text-gray-400 absolute">OR</span>
              </div>

              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => toast.error("Google login failed.")}
                  theme="filled_black"
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                  width="350"
                />
              </div>

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
          ) : (
            /* ── TRADITIONAL PASSWORD LOGIN ── */
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
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
                  className="w-full px-5 py-3 rounded-xl bg-[#0D0B0E]/60 text-white placeholder-gray-500 border border-[#8B1A24]/60 focus:outline-none focus:ring-2 focus:ring-[#FF8A75] focus:border-[#FF8A75] transition-all duration-300"
                />
              </div>

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
                  className="w-full px-5 py-3 rounded-xl bg-[#0D0B0E]/60 text-white placeholder-gray-500 border border-[#8B1A24]/60 focus:outline-none focus:ring-2 focus:ring-[#FF8A75] focus:border-[#FF8A75] transition-all duration-300"
                />
              </div>

              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-xs text-[#FF8A75] hover:text-white hover:underline transition font-medium"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-tr from-[#8B1A24] to-[#FF8A75] hover:opacity-95 text-white font-semibold py-3 rounded-xl shadow-lg shadow-[#8B1A24]/30 transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => toast.error("Google login failed.")}
                  theme="filled_black"
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                  width="350"
                />
              </div>

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
          )}

        </div>
      </div>
    </div>
  );
};

export default Login;