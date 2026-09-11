import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 1️⃣ Send Reset OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your registered Gmail address");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/send-otp`,
        { email }
      );

      toast.success(response.data.message || "Reset OTP sent to your Gmail!");
      setIsOtpSent(true);
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error(
        error.response?.data?.message || "Failed to send reset code. Check your email."
      );
    } finally {
      setLoading(false);
    }
  };

  // 2️⃣ Verify OTP & Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error("Please enter the 6-digit OTP code sent to your email.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/reset-password`,
        {
          email,
          otp,
          newPassword,
        }
      );

      toast.success(response.data.message || "Password reset successfully!");
      navigate("/login");
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error(
        error.response?.data?.message || "Failed to reset password. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] relative overflow-hidden px-4 py-12">
      {/* Background Glows */}
      <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-[#8B1A24]/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-[#FF8A75]/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-[#FF8A75]/20 rounded-3xl shadow-2xl p-8">
        
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

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-[#FF8A75]">
          {isOtpSent ? "Reset Password" : "Forgot Password?"}
        </h2>

        <p className="text-center text-gray-300 mt-2 mb-8 text-sm">
          {isOtpSent
            ? `Enter the OTP sent to ${email} and set your new password`
            : "Enter your registered Gmail to receive a password reset code"}
        </p>

        {/* ── STEP 2: VERIFY OTP & RESET PASSWORD ── */}
        {isOtpSent ? (
          <form onSubmit={handleResetPassword} className="space-y-5">
            {/* OTP Input */}
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

            {/* New Password */}
            <div>
              <label className="block text-xs text-gray-300 mb-1.5 font-medium">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-[#1C1C1C] text-white placeholder-gray-500 border border-[#8B1A24] focus:outline-none focus:ring-2 focus:ring-[#FF8A75] transition-all text-sm"
              />
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs text-gray-300 mb-1.5 font-medium">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-[#1C1C1C] text-white placeholder-gray-500 border border-[#8B1A24] focus:outline-none focus:ring-2 focus:ring-[#FF8A75] transition-all text-sm"
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
                  Resetting Password...
                </>
              ) : (
                "Reset Password"
              )}
            </button>

            {/* Controls */}
            <div className="flex justify-between items-center text-xs pt-2">
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className="text-[#FF8A75] hover:underline"
              >
                Resend Reset Code
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
        ) : (
          /* ── STEP 1: ENTER EMAIL ── */
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
                className="w-full px-5 py-3 rounded-xl bg-[#1C1C1C] text-white placeholder-gray-500 border border-[#8B1A24] focus:outline-none focus:ring-2 focus:ring-[#FF8A75] focus:border-[#FF8A75] transition-all"
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
                  Sending Reset OTP...
                </>
              ) : (
                "Send Password Reset OTP"
              )}
            </button>
          </form>
        )}

        {/* Back to Login Link */}
        <p className="text-gray-300 text-center mt-6 text-sm">
          Remembered your password?{" "}
          <Link
            to="/login"
            className="text-[#FF8A75] font-semibold hover:underline"
          >
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
