import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
//import mediaUpload from "../../utils/media";
import axios from "axios";

export default function AddProductPage() {
  const [productId, setProductId] = useState("");
  const [name, setName] = useState("");
  const [altName, setAltName] = useState([]);
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState([]);
  const [labelPrice, setLabelPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [isAvailable, setIsAvailable] = useState(true);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) return toast.error("Admin not logged in");

    if (!productId || !name) {
      return toast.error("Product ID and Name are required");
    }

    if (!image.length) {
      return toast.error("Please upload at least one image");
    }

    try {
      const imageUrls = await Promise.all(image.map(mediaUpload));

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/products`,
        {
          productId,
          name,
          altName,
          price: Number(price),
          description,
          image: imageUrls,
          labalPrice: Number(labelPrice),
          stock: Number(stock),
          isAvailable,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Product added successfully");
      navigate("/admin/products");

    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to add product"
      );
    }
  }

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center px-4 py-10 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-[#8B1A24]/30 rounded-full blur-3xl"></div>

      <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-[#FF8A75]/20 rounded-full blur-3xl"></div>


      {/* Card */}
      <div className="relative z-10 w-full max-w-xl bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-[#FF8A75]/20">

        {/* Header */}
        <h1 className="text-3xl font-bold text-[#FF8A75] text-center mb-2">
          Add Product
        </h1>

        <p className="text-sm text-gray-300 text-center mb-8">
          Create a new product for your store
        </p>


        <form onSubmit={handleSubmit} className="space-y-5">

          <Input
            label="Product ID"
            value={productId}
            onChange={setProductId}
          />


          <Input
            label="Product Name"
            value={name}
            onChange={setName}
          />


          <Input
            label="Alternative Names"
            value={altName.join(",")}
            onChange={(v) =>
              setAltName(
                v.split(",")
                .map((s) => s.trim())
                .filter(Boolean)
              )
            }
            placeholder="Comma separated"
          />


          <div className="grid grid-cols-2 gap-4">

            <Input
              label="Price (Rs.)"
              type="number"
              value={price}
              onChange={setPrice}
            />

            <Input
              label="Label Price"
              type="number"
              value={labelPrice}
              onChange={setLabelPrice}
            />

          </div>


          {/* Description */}
          <div>
            <label className="text-sm text-gray-300">
              Description
            </label>

            <textarea
              className="w-full mt-1 px-4 py-3 rounded-xl bg-[#1C1C1C] text-white border border-[#8B1A24] focus:ring-2 focus:ring-[#FF8A75] focus:outline-none"
              rows="3"
              value={description}
              onChange={(e)=>setDescription(e.target.value)}
            />

          </div>


          {/* Image Upload */}
          <div>

            <label className="text-sm text-gray-300">
              Product Images
            </label>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e)=>setImage(Array.from(e.target.files))}
              className="w-full mt-2 text-sm text-gray-300"
            />

          </div>


          {/* Stock */}
          <div className="flex items-center justify-between">

            <Input
              label="Stock"
              type="number"
              value={stock}
              onChange={setStock}
              small
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
              Add Product
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
  type="text",
  placeholder="",
  small
}) {

  return (

    <div className={small ? "w-32" : ""}>

      <label className="text-sm text-gray-300">
        {label}
      </label>


      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        className="w-full mt-1 px-4 py-3 rounded-xl bg-[#1C1C1C] text-white placeholder-gray-500 border border-[#8B1A24] focus:ring-2 focus:ring-[#FF8A75] focus:border-[#FF8A75] focus:outline-none transition"
      />

    </div>

  );
}