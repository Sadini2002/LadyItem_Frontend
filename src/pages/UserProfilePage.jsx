import { useEffect, useState } from "react";

export default function UserProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      setUser({
        id: payload.id,
        name: payload.name || "User",
        email: payload.email || "",
        role: payload.role || "BUYER",
      });
    } catch (error) {
      console.error("Failed to read user information:", error);
    }
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">
          Please login to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF5F4] px-6 py-10 pt-32">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8">

        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-[#8B1A24] text-white flex items-center justify-center text-3xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <h1 className="text-3xl font-bold text-[#8B1A24] mt-4">
            My Profile
          </h1>
        </div>

        <div className="space-y-5">

          <div>
            <label className="font-semibold text-gray-700">
              Name
            </label>

            <p className="mt-1 p-3 bg-gray-100 rounded-lg">
              {user.name}
            </p>
          </div>

          <div>
            <label className="font-semibold text-gray-700">
              Email
            </label>

            <p className="mt-1 p-3 bg-gray-100 rounded-lg">
              {user.email}
            </p>
          </div>

          <div>
            <label className="font-semibold text-gray-700">
              Role
            </label>

            <p className="mt-1 p-3 bg-gray-100 rounded-lg">
              {user.role}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}