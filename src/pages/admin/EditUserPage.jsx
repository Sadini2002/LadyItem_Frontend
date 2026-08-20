import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function EditUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [isBlock, setIsBlock] = useState(false);
  const [img, setImg] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

useEffect(() => {
  async function fetchUser() {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Admin not logged in");
      setLoading(false);
      return;
    }

    if (!id) {
      toast.error("User ID is missing");
      setLoading(false);
      return;
    }

    console.log("User ID:", id);

    const url = `${import.meta.env.VITE_BACKEND_URL.replace(
      /\/+$/,
      ""
    )}/api/users/${id}`;

    console.log("GET USER URL:", url);

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("GET USER RESPONSE:", response.data);

      const user = response.data.user || response.data;

      if (user.role !== "admin") {
        toast.error("User and customer accounts cannot be edited");
        navigate("/admin/user");
        return;
      }

      setFirstname(user.firstname || "");
      setLastname(user.lastname || "");
      setEmail(user.email || "");
      setRole(user.role || "admin");
      setIsBlock(Boolean(user.isBlock));
      setImg(user.img || "");

    } catch (error) {
      console.error("========== GET USER ERROR ==========");
      console.error("Error:", error);
      console.error("Status:", error?.response?.status);
      console.error("Response:", error?.response?.data);
      console.error("URL:", url);
      console.error("====================================");

      toast.error(
        error?.response?.data?.message ||
        "Failed to load user"
      );

    } finally {
      setLoading(false);
    }
  }

  fetchUser();
}, [id]);

  
  async function handleSubmit(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Admin not logged in");
      return;
    }

    if (!firstname.trim()) {
      toast.error("First name is required");
      return;
    }

    if (!lastname.trim()) {
      toast.error("Last name is required");
      return;
    }

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    try {
      setSaving(true);

      const userData = {
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        email: email.trim(),
        role,
        isBlock,
        img: img.trim(),
      };

      console.log("Updating user:", userData);

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL.replace(
          /\/+$/,
          ""
        )}/api/users/${id}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Updated user:", response.data);

      toast.success("User updated successfully");

      navigate("/admin/user");

    } catch (error) {
      console.error("========== UPDATE USER ERROR ==========");
      console.error("Error:", error);
      console.error("Status:", error?.response?.status);
      console.error("Response:", error?.response?.data);
      console.error("======================================");

      toast.error(
        error?.response?.data?.message ||
          "Failed to update user"
      );
    } finally {
      setSaving(false);
    }
  }

  // ================================
  // LOADING
  // ================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <p className="text-[#FF8A75] text-lg">
          Loading user...
        </p>
      </div>
    );
  }

  // ================================
  // PAGE
  // ================================

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center px-4 py-10 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-[#8B1A24]/30 rounded-full blur-3xl" />

      <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-[#FF8A75]/20 rounded-full blur-3xl" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-xl bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-[#FF8A75]/20">

        {/* Header */}
        <h1 className="text-3xl font-bold text-[#FF8A75] text-center mb-2">
          Edit User
        </h1>

        <p className="text-sm text-gray-300 text-center mb-8">
          Update user account details
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* First Name + Last Name */}
          <div className="grid grid-cols-2 gap-4">

            <Input
              label="First Name"
              value={firstname}
              onChange={setFirstname}
              placeholder="First name"
            />

            <Input
              label="Last Name"
              value={lastname}
              onChange={setLastname}
              placeholder="Last name"
            />

          </div>

          {/* Email */}
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="Email address"
          />

          {/* Role */}
          <div>
            <label className="text-sm text-gray-300">
              Role
            </label>

            <select
              value={role}
              onChange={(e) =>
                setRole(e.target.value)
              }
              className="w-full mt-1 px-4 py-3 rounded-xl bg-[#1C1C1C] text-white border border-[#8B1A24] focus:ring-2 focus:ring-[#FF8A75] focus:outline-none"
            >
              <option value="user">
                User
              </option>

              <option value="admin">
                Admin
              </option>
            </select>
          </div>

          {/* Profile Image */}
          <Input
            label="Profile Image URL"
            type="text"
            value={img}
            onChange={setImg}
            placeholder="https://example.com/profile.jpg"
          />

          {/* Image Preview */}
          {img && (
            <div className="flex justify-center">

              <img
                src={img}
                alt="User profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-[#FF8A75]"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />

            </div>
          )}

          {/* Block User */}
          <div className="flex items-center justify-between bg-[#1C1C1C] border border-[#8B1A24] rounded-xl px-4 py-4">

            <div>
              <p className="text-white font-medium">
                Block User
              </p>

              <p className="text-xs text-gray-400">
                Prevent this user from accessing the system
              </p>
            </div>

            <input
              type="checkbox"
              checked={isBlock}
              onChange={(e) =>
                setIsBlock(e.target.checked)
              }
              className="w-5 h-5 accent-[#8B1A24]"
            />

          </div>

          {/* Buttons */}
          <div className="flex justify-between pt-6">

            <Link
              to="/admin/user"
              className="px-6 py-3 rounded-xl bg-gray-700 text-white hover:bg-gray-600 transition"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 rounded-xl bg-[#8B1A24] text-white hover:bg-[#A61F2C] transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving
                ? "Updating..."
                : "Update User"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}


/* Reusable Input */

function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
}) {
  return (
    <div>

      <label className="text-sm text-gray-300">
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full mt-1 px-4 py-3 rounded-xl bg-[#1C1C1C] text-white placeholder-gray-500 border border-[#8B1A24] focus:ring-2 focus:ring-[#FF8A75] focus:border-[#FF8A75] focus:outline-none transition"
      />

    </div>
  );
}