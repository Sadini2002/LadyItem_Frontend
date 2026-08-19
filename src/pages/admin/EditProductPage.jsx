import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import mediaUpload from "../../utils/mediaUpload";

export default function EditProductPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Product data passed from Product List page
  const product = location.state;

  if (!product) {
    toast.error("No product data found");
    navigate("/admin/products");
    return null;
  }

  const [productId, setProductId] = useState(product.productId || "");
  const [name, setName] = useState("");
  const [altName, setAltName] = useState(product.altName || []);
  const [price, setPrice] = useState(product.price || 0);
  const [description, setDescription] = useState(product.description || "");
  const [existingImages, setExistingImages] = useState(product.image ||   []);
  const [newImages, setNewImages] = useState([]);
  const [labelPrice, setLabelPrice] = useState(product.labalPrice || 0);
  const [stock, setStock] = useState(product.stock || 0);
  const [isAvailable, setIsAvailable] = useState(product.isAvailable || true);

  const [loading, setLoading] = useState(false);

  

  async function handleSubmit(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Admin not logged in");
      return;
    }

    // Validation
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
    
    try {
      setLoading(true);

      // ---------------------------------------------
      // Upload new images
      // ---------------------------------------------

      let uploadedNewImages = [];

      if (newImages.length > 0) {
        uploadedNewImages = await Promise.all(
          newImages.map((file) => mediaUpload(file))
        );
      }

      // ---------------------------------------------
      // Prepare update data
      // ---------------------------------------------

      const productData = {
        name: name.trim(),

        altName: altName,

        price: Number(price),

        description: description.trim(),

        image: [
          ...existingImages,
          ...uploadedNewImages,
        ],

        // IMPORTANT:
        // Your mongoose schema uses "labalPrice"
        labalPrice: Number(labelPrice),

        stock: Number(stock),

        isAvailable: isAvailable,
      };

      console.log("Product ID:", productId);
      console.log("Update data:", productData);

      // ---------------------------------------------
      // Update product using productId
      // ---------------------------------------------

      const backendUrl =
        import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, "");

      await axios.put(
        `${backendUrl}/api/products/productId/${productId}`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Product updated successfully");

      navigate("/admin/products");

    } catch (error) {
      console.error("UPDATE PRODUCT ERROR:", error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to update product";

      toast.error(message);

    } finally {
      setLoading(false);
    }
  }

  // ---------------------------------------------
  // No product data
  // ---------------------------------------------

  if (!product) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <p className="text-white">
          Redirecting...
        </p>
      </div>
    );
  }

  // ---------------------------------------------
  // UI
  // ---------------------------------------------

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center px-4 py-10 relative overflow-hidden">

      {/* Background Glow */}

      <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-[#8B1A24]/30 rounded-full blur-3xl" />

      <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-[#FF8A75]/20 rounded-full blur-3xl" />

      {/* Card */}

      <div className="relative z-10 w-full max-w-xl bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-[#FF8A75]/20">

        {/* Header */}

        <h1 className="text-3xl font-bold text-[#FF8A75] text-center mb-2">
          Edit Product
        </h1>

        <p className="text-sm text-gray-300 text-center mb-8">
          Update your product information
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Product ID */}

          <div>
            <label className="text-sm text-gray-300">
              Product ID
            </label>

            <input
              type="text"
              value={productId}
              disabled
              className="w-full mt-1 px-4 py-3 rounded-xl bg-[#252525] text-gray-400 border border-[#8B1A24] cursor-not-allowed"
            />

            <p className="text-xs text-gray-500 mt-1">
              Product ID cannot be changed.
            </p>
          </div>

          {/* Product Name */}

          <div>
            <label className="text-sm text-gray-300">
              Product Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter product name"
              className="w-full mt-1 px-4 py-3 rounded-xl bg-[#1C1C1C] text-white placeholder-gray-500 border border-[#8B1A24] focus:ring-2 focus:ring-[#FF8A75] focus:outline-none"
            />
          </div>

          {/* Alternative Names */}

          <div>
            <label className="text-sm text-gray-300">
              Alternative Names
            </label>

            <input
              type="text"
              value={altName.join(", ")}
              onChange={(e) => {
                const names = e.target.value
                  .split(",")
                  .map((item) => item.trim())
                  .filter(Boolean);

                setAltName(names);
              }}
              placeholder="Example: Shirt, T-Shirt"
              className="w-full mt-1 px-4 py-3 rounded-xl bg-[#1C1C1C] text-white placeholder-gray-500 border border-[#8B1A24] focus:ring-2 focus:ring-[#FF8A75] focus:outline-none"
            />

            <p className="text-xs text-gray-500 mt-1">
              Separate names using commas.
            </p>
          </div>

          {/* Price */}

          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="text-sm text-gray-300">
                Price (Rs.)
              </label>

              <input
                type="number"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                className="w-full mt-1 px-4 py-3 rounded-xl bg-[#1C1C1C] text-white border border-[#8B1A24] focus:ring-2 focus:ring-[#FF8A75] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">
                Label Price (Rs.)
              </label>

              <input
                type="number"
                min="0"
                value={labelPrice}
                onChange={(e) => setLabelPrice(e.target.value)}
                placeholder="0"
                className="w-full mt-1 px-4 py-3 rounded-xl bg-[#1C1C1C] text-white border border-[#8B1A24] focus:ring-2 focus:ring-[#FF8A75] focus:outline-none"
              />
            </div>

          </div>

          {/* Description */}

          <div>
            <label className="text-sm text-gray-300">
              Description
            </label>

            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description"
              className="w-full mt-1 px-4 py-3 rounded-xl bg-[#1C1C1C] text-white placeholder-gray-500 border border-[#8B1A24] focus:ring-2 focus:ring-[#FF8A75] focus:outline-none resize-none"
            />
          </div>

          {/* Existing Images */}

          <div>
            <label className="text-sm text-gray-300">
              Existing Images
            </label>

            <div className="flex gap-3 flex-wrap mt-2">

              {existingImages.length > 0 ? (
                existingImages.map((img, index) => (
                  <div
                    key={index}
                    className="relative"
                  >
                    <img
                      src={img}
                      alt={`Product ${index + 1}`}
                      className="w-20 h-20 rounded-xl object-cover border border-[#FF8A75]"
                    />
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  No existing images
                </p>
              )}

            </div>
          </div>

          {/* New Images */}

          <div>
            <label className="text-sm text-gray-300">
              Add New Images
            </label>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                setNewImages(
                  Array.from(e.target.files || [])
                );
              }}
              className="w-full mt-2 text-sm text-gray-300"
            />

            {newImages.length > 0 && (
              <p className="text-sm text-gray-400 mt-2">
                {newImages.length} new image(s) selected
              </p>
            )}
          </div>

          {/* Stock + Availability */}

          <div className="flex items-end justify-between">

            <div>
              <label className="text-sm text-gray-300">
                Stock
              </label>

              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="0"
                className="w-32 mt-1 px-4 py-3 rounded-xl bg-[#1C1C1C] text-white border border-[#8B1A24] focus:ring-2 focus:ring-[#FF8A75] focus:outline-none"
              />
            </div>

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
                ? "Updating Product..."
                : "Update Product"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}