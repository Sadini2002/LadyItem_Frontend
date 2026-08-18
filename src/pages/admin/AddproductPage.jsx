import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import mediaUpload from "../../utils/mediaUpload";

export default function AddProductPage() {
  const [productId, setProductId] = useState("");
  const [name, setName] = useState("");
  const [altName, setAltName] = useState([]);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState([]);
  const [labelPrice, setLabelPrice] = useState("");
  const [stock, setStock] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Admin not logged in");
      return;
    }

    if (!productId.trim()) {
      toast.error("Product ID is required");
      return;
    }

    if (!name.trim()) {
      toast.error("Product name is required");
      return;
    }

    if (price === "" || Number(price) < 0) {
      toast.error("Please enter a valid price");
      return;
    }

    if (labelPrice === "" || Number(labelPrice) < 0) {
      toast.error("Please enter a valid label price");
      return;
    }

    if (stock === "" || Number(stock) < 0) {
      toast.error("Please enter a valid stock");
      return;
    }

    if (image.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    try {
      setLoading(true);

      // -----------------------------------
      // 1. Upload images to Supabase
      // -----------------------------------

      console.log("Uploading images...");

      const imageUrls = await Promise.all(
        image.map((file) => mediaUpload(file))
      );

      console.log("Uploaded image URLs:", imageUrls);

      // -----------------------------------
      // 2. Prepare data according to backend
      // -----------------------------------

      const productData = {
        productId: productId.trim(),

        name: name.trim(),

        altName: altName,

        price: Number(price),

        description: description.trim(),

        image: imageUrls,

        // IMPORTANT:
        // Your backend model uses "labalPrice"
        labalPrice: Number(labelPrice),

        stock: Number(stock),

        isAvailable: isAvailable,
      };

      console.log("Product data:", productData);

      // -----------------------------------
      // 3. Send product to backend
      // -----------------------------------

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/products`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Product response:", response.data);

      toast.success("Product added successfully");

      // -----------------------------------
      // 4. Navigate
      // -----------------------------------

      navigate("/admin/products");

    } catch (error) {
      console.error("========== ADD PRODUCT ERROR ==========");

      console.error("Error:", error);

      console.error(
        "Status:",
        error?.response?.status
      );

      console.error(
        "Response:",
        error?.response?.data
      );

      console.error(
        "Backend error:",
        error?.response?.data?.error
      );

      console.error("======================================");

      const message =
        error?.response?.data?.error?.message ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to add product";

      toast.error(message);

    } finally {
      setLoading(false);
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

          {/* Product ID */}
          <Input
            label="Product ID"
            value={productId}
            onChange={setProductId}
            placeholder="Enter product ID"
          />

          {/* Product Name */}
          <Input
            label="Product Name"
            value={name}
            onChange={setName}
            placeholder="Enter product name"
          />

          {/* Alternative Names */}
          <Input
            label="Alternative Names"
            value={altName.join(", ")}
            onChange={(value) => {
              const names = value
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean);

              setAltName(names);
            }}
            placeholder="Example: Shirt, T-Shirt"
          />

          {/* Price */}
          <div className="grid grid-cols-2 gap-4">

            <Input
              label="Price (Rs.)"
              type="number"
              value={price}
              onChange={setPrice}
              placeholder="0"
            />

            <Input
              label="Label Price"
              type="number"
              value={labelPrice}
              onChange={setLabelPrice}
              placeholder="0"
            />

          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-gray-300">
              Description
            </label>

            <textarea
              rows="4"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Enter product description"
              className="w-full mt-1 px-4 py-3 rounded-xl bg-[#1C1C1C] text-white placeholder-gray-500 border border-[#8B1A24] focus:ring-2 focus:ring-[#FF8A75] focus:outline-none"
            />
          </div>

          {/* Images */}
          <div>

            <label className="text-sm text-gray-300">
              Product Images
            </label>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                setImage(
                  Array.from(e.target.files || [])
                );
              }}
              className="w-full mt-2 text-sm text-gray-300"
            />

            {image.length > 0 && (
              <p className="text-sm text-gray-400 mt-2">
                {image.length} image(s) selected
              </p>
            )}

          </div>

          {/* Stock + Availability */}
          <div className="flex items-end justify-between">

            <Input
              label="Stock"
              type="number"
              value={stock}
              onChange={setStock}
              placeholder="0"
              small
            />

            <label className="flex items-center gap-3 text-sm text-gray-300 mb-3">

              Available

              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) =>
                  setIsAvailable(e.target.checked)
                }
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
              disabled={loading}
              className="px-8 py-3 rounded-xl bg-[#8B1A24] text-white hover:bg-[#A61F2C] transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Adding Product..."
                : "Add Product"}
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
  small = false,
}) {
  return (
    <div className={small ? "w-32" : "w-full"}>

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