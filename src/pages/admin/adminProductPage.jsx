import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTrashCan } from "react-icons/fa6";
import { CiEdit } from "react-icons/ci";
import toast from "react-hot-toast";

export default function AdminProductPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(
        `${import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, "")}/api/products`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then((res) => {
        setProducts(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load products");
      });
  }, []);


  function deleteProduct(id) {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Admin not logged in");
      return;
    }

    axios
      .delete(
        `${import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, "")}/api/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        toast.success("Product deleted successfully");

        setProducts((prev) =>
          prev.filter((item) => item._id !== id)
        );
      })
      .catch(() => {
        toast.error("Failed to delete product");
      });
  }


  return (
    <div className="min-h-screen w-full p-6 bg-[#121212] relative overflow-auto">


      {/* Background Glow */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-[#8B1A24]/30 rounded-full blur-3xl"></div>

      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-[#FF8A75]/20 rounded-full blur-3xl"></div>



      {/* Add Product Button */}
      <Link
        to="/admin/addProduct"
        className="fixed bottom-6 right-6 z-20 bg-[#8B1A24] text-white w-16 h-16 rounded-full shadow-xl hover:bg-[#A61F2C] flex items-center justify-center text-4xl transition-transform hover:scale-110"
      >
        +
      </Link>



      {!isLoading ? (
        <>

          {/* Desktop Table */}

          <div className="relative z-10 hidden md:block overflow-x-auto rounded-3xl shadow-xl bg-white/5 backdrop-blur-xl border border-[#FF8A75]/20 p-6 overflow-y-scroll">


            <table className="w-full text-center border-collapse min-w-[700px]">


              <thead>

                <tr className="bg-[#8B1A24] text-white">

                  <th className="p-3 rounded-tl-xl">
                    Product ID
                  </th>

                  <th className="p-3">
                    Image
                  </th>

                  <th className="p-3">
                    Name
                  </th>

                  <th className="p-3">
                    Price (Rs.)
                  </th>

                  <th className="p-3">
                    Stock
                  </th>

                  <th className="p-3 rounded-tr-xl">
                    Actions
                  </th>

                </tr>

              </thead>



              <tbody>

                {products.length > 0 ? (

                  products.map((item)=>(

                    <tr
                      key={item._id}
                      className="text-gray-200 hover:bg-white/10 transition"
                    >


                      <td className="p-3 border-b border-gray-700">
                        {item.productId}
                      </td>


                      <td className="p-3 border-b border-gray-700">

                        {item.image?.length > 0 ? (

                          <img
                            src={item.image[0]}
                            alt={item.name}
                            className="w-16 h-16 object-cover mx-auto rounded-xl border border-[#FF8A75]"
                          />

                        ) : (
                          <span className="text-gray-400">
                            No Image
                          </span>
                        )}

                      </td>



                      <td className="p-3 border-b border-gray-700">
                        {item.name}
                      </td>



                      <td className="p-3 border-b border-gray-700">
                        Rs. {item.price}
                      </td>



                      <td className="p-3 border-b border-gray-700">
                        {item.stock}
                      </td>



                      <td className="p-3 border-b border-gray-700">

                        <div className="flex justify-center gap-5 text-xl">


                          <FaTrashCan
                            className="cursor-pointer text-red-400 hover:text-red-600"
                            onClick={() =>
                              deleteProduct(item._id)
                            }
                          />


                          <CiEdit
                            className="cursor-pointer text-[#FF8A75] hover:text-white"
                            onClick={() =>
                              navigate(
                                `/edit-product/${item._id}`,
                                {
                                  state:item
                                }
                              )
                            }
                          />


                        </div>

                      </td>


                    </tr>

                  ))

                ):(

                  <tr>

                    <td
                      colSpan="6"
                      className="p-6 text-gray-400"
                    >
                      No products found.
                    </td>

                  </tr>

                )}

              </tbody>


            </table>

          </div>




          {/* Mobile View */}

          <div className="relative z-10 md:hidden grid grid-cols-1 gap-4">


            {products.length > 0 ? (

              products.map((item)=>(


                <div
                  key={item._id}
                  className="bg-white/5 backdrop-blur-xl border border-[#FF8A75]/20 rounded-2xl shadow-lg p-4 flex items-center gap-4 text-white"
                >


                  {item.image?.length > 0 ? (

                    <img
                      src={item.image[0]}
                      alt={item.name}
                      className="w-24 h-24 rounded-xl object-cover border border-[#FF8A75]"
                    />

                  ):(
                    <div className="w-24 h-24 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}



                  <div className="flex-1">

                    <h3 className="font-semibold text-lg text-[#FF8A75]">
                      {item.name}
                    </h3>

                    <p className="text-gray-300">
                      ID: {item.productId}
                    </p>

                    <p className="text-gray-300">
                      Price: Rs. {item.price}
                    </p>

                  </div>



                  <div className="flex gap-4">


                    <FaTrashCan
                      className="cursor-pointer text-red-400 hover:text-red-600 text-xl"
                      onClick={() =>
                        deleteProduct(item._id)
                      }
                    />


                    <CiEdit
                      className="cursor-pointer text-[#FF8A75] hover:text-white text-xl"
                      onClick={() =>
                        navigate(
                          "/admin/edit-product",
                          {
                            state:item
                          }
                        )
                      }
                    />


                  </div>


                </div>


              ))

            ):(
              <p className="text-center text-gray-400">
                No products found.
              </p>
            )}

          </div>


        </>

      ):(
        <h1 className="text-center text-[#FF8A75] text-xl">
          Loading...
        </h1>
      )}

    </div>
  );
}
