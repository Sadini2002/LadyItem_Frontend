import axios from "axios";
import { useEffect, useState } from "react";
import { FaTrashCan } from "react-icons/fa6";
import { CiEdit } from "react-icons/ci";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

export default function AdminUserPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();


  // Fetch users
  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(
        `${import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, "")}/api/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setUsers(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        toast.error("Admin not logged in");
      });

  }, []);



  // Delete user
  function deleteUser(id) {

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Admin not logged in");
      return;
    }


    axios
      .delete(
        `${import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, "")}/api/users/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {

        toast.success("User deleted successfully");

        setUsers((prev) =>
          prev.filter((user) => user._id !== id)
        );

      })
      .catch(() => {
        toast.error("Failed to delete user");
      });

  }



  return (

    <div className="min-h-screen w-full p-6 bg-[#121212] relative overflow-auto">


      {/* Background Glow */}

      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-[#8B1A24]/30 rounded-full blur-3xl"></div>


      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-[#FF8A75]/20 rounded-full blur-3xl"></div>




      {/* Add User Button */}

      <Link
        to="/admin/addUser"
        className="fixed bottom-6 right-6 z-20 bg-[#8B1A24] text-white w-16 h-16 rounded-full shadow-xl hover:bg-[#A61F2C] flex items-center justify-center text-4xl transition-transform hover:scale-110"
      >
        +
      </Link>




      {!isLoading ? (

        <div className="relative z-10 overflow-x-auto rounded-3xl shadow-xl bg-white/5 backdrop-blur-xl border border-[#FF8A75]/20 p-6">


          <table className="w-full text-center border-collapse min-w-[700px]">


            <thead>

              <tr className="bg-[#8B1A24] text-white">

              <th className="p-3">No.</th>

                


                <th className="p-3">
                  Name
                </th>


                <th className="p-3">
                  Email
                </th>


                <th className="p-3">
                  Role
                </th>


                <th className="p-3 rounded-tr-xl">
                  Actions
                </th>


              </tr>

            </thead>



            <tbody>


              {users.length > 0 ? (

                users.map((user, index)=>(

                  <tr
                    key={user._id}
                    className="text-gray-200 hover:bg-white/10 transition"
                  >
                    <td className="p-3 border-b border-gray-700">
                    {index + 1}
                      </td>


                    


                    <td className="p-3 border-b border-gray-700">
                      {user.firstname} {user.lastname}
                    </td>


                    <td className="p-3 border-b border-gray-700">
                      {user.email}
                    </td>


                    <td className="p-3 border-b border-gray-700 capitalize">
                      {user.role}
                    </td>



                    <td className="p-3 border-b border-gray-700">

                      <div className="flex justify-center items-center gap-5 text-xl">


                        <FaTrashCan
                          className="cursor-pointer text-red-400 hover:text-red-600 transition"
                          onClick={() =>
                            deleteUser(user._id)
                          }
                        />


                        <CiEdit
                          className="cursor-pointer text-[#FF8A75] hover:text-white transition"
                          onClick={() =>
                            navigate(`/admin/edit-user/${user._id}`)
                          }
                        />


                      </div>

                    </td>


                  </tr>


                ))


              ):(

                <tr>

                  <td
                    className="p-6 text-gray-400"
                    colSpan="5"
                  >
                    No users found.
                  </td>

                </tr>

              )}


            </tbody>


          </table>


        </div>


      ):(

        <h1 className="text-center text-[#FF8A75] text-xl">
          Loading...
        </h1>

      )}


    </div>

  );
}