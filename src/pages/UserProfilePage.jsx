import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Shield,
  CheckCircle,
  Edit3,
  Save,
  X,
  LogOut,
  Camera,
} from "lucide-react";

export default function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    img: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const userData = response.data.user;

        setUser(userData);

        setFormData({
          firstname: userData.firstname || "",
          lastname: userData.lastname || "",
          email: userData.email || "",
          img: userData.img || "",
        });
      } catch (error) {
        console.error("Profile error:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
        }
      } finally {
        setLoading(false);
      }
    };

    getUserProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/profile`,
        {
          firstname: formData.firstname,
          lastname: formData.lastname,
          email: formData.email,
          img: formData.img,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUser(response.data.user);
      setEditing(false);

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Update profile error:", error);

      toast.error(
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    toast.success("Logged out successfully");

    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFF5F4] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#8B1A24] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FFF5F4] flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-[#FFF0F0] rounded-full flex items-center justify-center mx-auto mb-5">
            <User size={38} className="text-[#8B1A24]" />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Login Required
          </h2>

          <p className="text-gray-500 mb-6">
            Please login to view your profile.
          </p>

          <button
            onClick={() => navigate("/login")}
            className="bg-[#8B1A24] text-white px-7 py-3 rounded-xl font-semibold hover:bg-[#70151d] transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212]  pt-28 pb-12 px-4 sm:px-6">

      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-[#dd858c] font-semibold text-sm uppercase tracking-wider">
            Account
          </p>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-200 mt-1">
            My Profile
          </h1>

          <p className="text-gray-300 mt-2">
            Manage your personal information and account details.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

          {/* Profile Cover */}
          <div className="h-36 bg-gradient-to-r from-[#8B1A24] via-[#A82A35] to-[#D56B73] relative">
            <div className="absolute inset-0 opacity-10">
              <div className="w-full h-full bg-white"></div>
            </div>
          </div>

          {/* Profile Header */}
          <div className="px-6 sm:px-10 pb-6">

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">

              {/* Profile Image */}
              <div className="relative -mt-16">

                <div className="w-32 h-32 rounded-full bg-white p-2 shadow-lg">

                  {user.img ? (
                    <img
                      src={user.img}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-[#FFF0F0] flex items-center justify-center">
                      <User
                        size={55}
                        className="text-[#8B1A24]"
                      />
                    </div>
                  )}

                </div>

                {editing && (
                  <button
                    className="absolute bottom-1 right-1 bg-[#8B1A24] text-white p-2 rounded-full shadow-lg hover:bg-[#70151d] transition"
                    title="Change profile image"
                  >
                    <Camera size={17} />
                  </button>
                )}

              </div>

              {/* Buttons */}
              <div className="flex gap-3">

                {!editing ? (
                  <>
                    <button
                      onClick={() => setEditing(true)}
                      className="flex items-center gap-2 px-5 py-2.5 border border-[#8B1A24] text-[#8B1A24] rounded-xl font-semibold hover:bg-[#FFF0F0] transition"
                    >
                      <Edit3 size={17} />
                      Edit Profile
                    </button>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition"
                    >
                      <LogOut size={17} />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditing(false);

                        setFormData({
                          firstname: user.firstname || "",
                          lastname: user.lastname || "",
                          email: user.email || "",
                          img: user.img || "",
                        });
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition"
                    >
                      <X size={17} />
                      Cancel
                    </button>

                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#8B1A24] text-white rounded-xl font-semibold hover:bg-[#70151d] transition disabled:opacity-60"
                    >
                      <Save size={17} />

                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </>
                )}

              </div>

            </div>

            {/* Name */}
            <div className="mt-5">
              <h2 className="text-2xl font-bold text-gray-800">
                {user.firstname} {user.lastname}
              </h2>

              <p className="text-gray-500 mt-1">
                {user.email}
              </p>
            </div>

          </div>

          {/* Information */}
          <div className="border-t border-gray-100 px-6 sm:px-10 py-8">

            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* First Name */}
              <div>
                <label className="text-sm text-gray-500 mb-2 block">
                  First Name
                </label>

                {editing ? (
                  <input
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#8B1A24]"
                  />
                ) : (
                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                    <User size={19} className="text-[#8B1A24]" />
                    <span className="font-semibold text-gray-700">
                      {user.firstname}
                    </span>
                  </div>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="text-sm text-gray-500 mb-2 block">
                  Last Name
                </label>

                {editing ? (
                  <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#8B1A24]"
                  />
                ) : (
                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                    <User size={19} className="text-[#8B1A24]" />
                    <span className="font-semibold text-gray-700">
                      {user.lastname}
                    </span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <label className="text-sm text-gray-500 mb-2 block">
                  Email Address
                </label>

                {editing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#8B1A24]"
                  />
                ) : (
                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                    <Mail size={19} className="text-[#8B1A24]" />
                    <span className="font-semibold text-gray-700">
                      {user.email}
                    </span>
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* Account Details */}
          <div className="border-t border-gray-100 px-6 sm:px-10 py-8">

            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Account Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Role */}
              <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-5">

                <div className="flex items-center gap-4">

                  <div className="w-11 h-11 rounded-xl bg-[#FFF0F0] flex items-center justify-center">
                    <Shield
                      size={22}
                      className="text-[#8B1A24]"
                    />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Account Role
                    </p>

                    <p className="font-bold text-gray-800 capitalize">
                      {user.role}
                    </p>
                  </div>

                </div>

                <span className="px-3 py-1 bg-[#FFF0F0] text-[#8B1A24] rounded-full text-xs font-bold capitalize">
                  {user.role}
                </span>

              </div>

              {/* Status */}
              <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-5">

                <div className="flex items-center gap-4">

                  <div className="w-11 h-11 rounded-xl bg-green-100 flex items-center justify-center">
                    <CheckCircle
                      size={22}
                      className="text-green-600"
                    />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Account Status
                    </p>

                    <p className="font-bold text-gray-800">
                      {user.isBlock ? "Blocked" : "Active"}
                    </p>
                  </div>

                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    user.isBlock
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {user.isBlock ? "Blocked" : "Active"}
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
