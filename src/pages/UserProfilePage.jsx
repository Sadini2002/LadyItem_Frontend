import { useEffect, useState } from "react";
import axios from "axios";

export default function UserProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "http://localhost:3000/api/users/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setUser(response.data);
      } catch (error) {
        console.error("Profile error:", error);
      } finally {
        setLoading(false);
      }
    };

    getUserProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please login to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF5F4] pt-32 px-6">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-[#8B1A24] mb-8">
          My Profile
        </h1>

        <div className="space-y-5">
          <div>
            <p className="text-gray-500">User ID</p>
            <p className="font-semibold">{user.id}</p>
          </div>

          <div>
            <p className="text-gray-500">Name</p>
            <p className="font-semibold">{user.name}</p>
          </div>

          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-semibold">{user.email}</p>
          </div>

          <div>
            <p className="text-gray-500">Role</p>
            <p className="font-semibold">{user.role}</p>
          </div>

          <div>
            <p className="text-gray-500">Verified</p>
            <p className="font-semibold">
              {user.verified ? "Verified" : "Not Verified"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Created Date</p>
            <p className="font-semibold">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}