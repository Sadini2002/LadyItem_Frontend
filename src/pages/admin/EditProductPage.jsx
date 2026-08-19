import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";


export default function EditProductPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state;

  if (!product) {
    toast.error("No product data found");
    navigate("/admin/products");
    return null;
  }

  const [productId, setProductId] = useState(product.productId || "");
  const [name, setName] = useState(product.name || "");
  const [altName, setAltName] = useState(product.altName || []);
  const [price, setPrice] = useState(product.price || 0);
  const [description, setDescription] = useState(product.description || "");
  const [existingImages, setExistingImages] = useState(product.image || []);
  const [newImages, setNewImages] = useState([]);
  const [labelPrice, setLabelPrice] = useState(product.labelPrice || 0);
  const [stock, setStock] = useState(product.stock || 0);
  const [isAvailable, setIsAvailable] = useState(product.isAvailable ?? true);

  async function handleSubmit(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      return toast.error("Admin not logged in");
    }

    let uploadedNewImages = [];

    if (newImages.length) {
      try {
        uploadedNewImages = await Promise.all(
          newImages.map((file) => mediaUpload(file))
        );
      } catch {
        return toast.error("Image upload failed");
      }
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, "")}/api/products/${product._id}`,
        {
          productId,
          name,
          altName,
          price: Number(price),
          description,
          image: [...existingImages, ...uploadedNewImages],
          labelPrice: Number(labelPrice),
          stock: Number(stock),
          isAvailable,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Product updated successfully");
      navigate("/admin/products");

    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Update failed"
      );
    }
  }


  return (
    <div className="min-h-screen flex justify-center items-center bg-[#121212] px-4 py-10 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-[#8B1A24]/30 rounded-full blur-3xl"></div>

      <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-[#FF8A75]/20 rounded-full blur-3xl"></div>


      {/* Card */}
      <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-[#FF8A75]/20 shadow-2xl rounded-3xl p-8 w-full max-w-lg">


        {/* Header */}
        <h1 className="text-3xl font-bold text-[#FF8A75] text-center mb-2">
          Edit Product
        </h1>

        <p className="text-sm text-gray-300 text-center mb-8">
          Update product details carefully
        </p>


        <form onSubmit={handleSubmit} className="space-y-5">


          {/* Product ID & Name */}
          {[
            ["Product ID", productId, setProductId],
            ["Product Name", name, setName],
          ].map(([label, value, setter], i) => (

            <div key={i}>

              <label className="text-sm text-gray-300">
                {label}
              </label>

              <input
                value={value}
                onChange={(e)=>setter(e.target.value)}
                className="w-full mt-1 px-4 py-3 rounded-xl bg-[#1C1C1C] text-white border border-[#8B1A24] focus:ring-2 focus:ring-[#FF8A75] focus:outline-none"
              />

            </div>

          ))}



          {/* Alternative Names */}
          <div>

            <label className="text-sm text-gray-300">
              Alternative Names
            </label>

            <input
              value={altName.join(",")}
              onChange={(e)=>
                setAltName(
                  e.target.value
                  .split(",")
                  .map(s=>s.trim())
                  .filter(Boolean)
                )
              }
              className="w-full mt-1 px-4 py-3 rounded-xl bg-[#1C1C1C] text-white border border-[#8B1A24] focus:ring-2 focus:ring-[#FF8A75] focus:outline-none"
            />

          </div>



          {/* Price */}
          <div className="grid grid-cols-2 gap-4">

            {[
              ["Price", price, setPrice],
              ["Label Price", labelPrice, setLabelPrice],
            ].map(([label,value,setter],i)=>(

              <div key={i}>

                <label className="text-sm text-gray-300">
                  {label}
                </label>

                <input
                  type="number"
                  value={value}
                  onChange={(e)=>setter(e.target.value)}
                  className="w-full mt-1 px-4 py-3 rounded-xl bg-[#1C1C1C] text-white border border-[#8B1A24] focus:ring-2 focus:ring-[#FF8A75] focus:outline-none"
                />

              </div>

            ))}

          </div>



          {/* Description */}
          <div>

            <label className="text-sm text-gray-300">
              Description
            </label>

            <textarea
              rows="3"
              value={description}
              onChange={(e)=>setDescription(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-xl bg-[#1C1C1C] text-white border border-[#8B1A24] focus:ring-2 focus:ring-[#FF8A75] focus:outline-none"
            />

          </div>



          {/* Existing Images */}
          <div className="flex gap-3 flex-wrap">

            {existingImages.map((img,i)=>(

              <img
                key={i}
                src={img}
                className="w-16 h-16 rounded-xl object-cover border border-[#FF8A75]"
              />

            ))}

          </div>



          {/* Upload */}
          <input
            type="file"
            multiple
            onChange={(e)=>setNewImages(Array.from(e.target.files))}
            className="w-full text-sm text-gray-300"
          />



          {/* Stock */}
          <div className="flex items-center justify-between">

            <input
              type="number"
              value={stock}
              onChange={(e)=>setStock(e.target.value)}
              placeholder="Stock"
              className="w-32 px-4 py-3 rounded-xl bg-[#1C1C1C] text-white border border-[#8B1A24] focus:ring-2 focus:ring-[#FF8A75] focus:outline-none"
            />


            <label className="flex items-center gap-3 text-sm text-gray-300">

              Available

              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e)=>setIsAvailable(e.target.checked)}
                className="accent-[#8B1A24]"
              />

            </label>

          </div>



          {/* Buttons */}
          <div className="flex justify-between pt-6">


            <Link
              to="/admin/products"
              className="px-6 py-3 rounded-xl bg-gray-700 text-white hover:bg-gray-600 transition"
            >
              Cancel
            </Link>


            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-[#8B1A24] text-white hover:bg-[#A61F2C] transition shadow-lg"
            >
              Update Product
            </button>


          </div>


        </form>

      </div>

    </div>
  );
}