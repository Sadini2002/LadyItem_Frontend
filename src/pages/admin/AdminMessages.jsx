import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem("token");

        // Check login token
        if (!token) {
          console.log("No token found");
          setError("Please login as an admin.");
          setLoading(false);
          return;
        }

        // Get messages from backend
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/messages`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Messages response:", res.data);

        // Backend returns array
        if (Array.isArray(res.data)) {
          setMessages(res.data);
        }

        // Backend returns { messages: [...] }
        else if (Array.isArray(res.data.messages)) {
          setMessages(res.data.messages);
        }

        // Backend returns { data: [...] }
        else if (Array.isArray(res.data.data)) {
          setMessages(res.data.data);
        }

        // Unexpected response
        else {
          console.log("Unexpected response:", res.data);
          setMessages([]);
        }

      } catch (err) {
        console.error("Error fetching messages:", err);
        console.error("Server response:", err.response?.data);

        if (err.response?.status === 401) {
          setError("Unauthorized. Please login again.");
        } else if (err.response?.status === 403) {
          setError("You do not have permission to view messages.");
        } else if (err.response?.status === 404) {
          setError("Messages API route was not found.");
        } else {
          setError("Failed to load messages.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF5F4]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#8B1A24] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-gray-600 text-lg">
            Loading messages...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF5F4] pt-2 px-6 pb-2">

      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div >

         

          <h1 className="text-3xl font-bold text-gray-800 mt-1">
            User Messages
          </h1>

          <p className="text-gray-500 mt-2">
            View messages submitted by users.
          </p>

        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-5 mb-6">
            <p className="font-semibold">
              {error}
            </p>
          </div>
        )}

        {/* Message Count */}
        {!error && messages.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-1000 text-sm">
                  Total Messages
                </p>

                <h2 className="text-2xl font-bold text-[#8B1A24]">
                  {messages.length}
                </h2>
              </div>

              <div className="w-12 h-12 bg-[#FFF5F4] rounded-full flex items-center justify-center">
                <span className="text-2xl">
                  💬
                </span>
              </div>

            </div>

          </div>
        )}

        {/* No Messages */}
        {!error && messages.length === 0 && (
          <div className="bg-white rounded-3xl shadow-md p-10 text-center">

            <div className="text-5xl mb-4">
              💬
            </div>

            <h2 className="text-xl font-semibold text-gray-700">
              No messages found
            </h2>

            <p className="text-gray-500 mt-2">
              There are currently no user messages.
            </p>

          </div>
        )}

        {/* Messages */}
        {!error && messages.length > 0 && (
          <div className="space-y-4">

            {messages.map((msg) => (

              <div
                key={msg._id}
                className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition duration-300"
              >

                {/* User Information */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">

                  <div className="flex items-center gap-4">

                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-[#8B1A24] text-white flex items-center justify-center font-bold text-lg">
                      {msg.name
                        ? msg.name.charAt(0).toUpperCase()
                        : "U"}
                    </div>

                    <div>

                      <h3 className="text-lg font-bold text-gray-800">
                        {msg.name || "Unknown User"}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {msg.email || "No email"}
                      </p>

                    </div>

                  </div>

                  {/* Date */}
                  <p className="text-xs text-gray-400">
                    {msg.createdAt
                      ? new Date(msg.createdAt).toLocaleString()
                      : "Date unavailable"}
                  </p>

                </div>

                {/* Message */}
                <div className="bg-[#FFF5F4] rounded-xl p-5">

                  <p className="text-gray-700 leading-relaxed">
                    {msg.message || "No message content"}
                  </p>

                </div>

                {/* Status */}
                <div className="mt-4 flex justify-end">

                  {msg.isRead ? (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                      Read
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">
                      Unread
                    </span>
                  )}

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

    </div>
  );
}