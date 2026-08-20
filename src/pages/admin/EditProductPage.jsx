import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import mediaUpload from "../../utils/mediaUpload";

export default function EditProductPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { productId: urlProductId } = useParams();

  const [productId, setProductId] = useState(location.state?.productId || urlProductId || "");
  const [name, setName] = useState(location.state?.name || "");
  const [altName, setAltName] = useState(location.state?.altName || []);
  const [price, setPrice] = useState(location.state?.price ?? "");
  const [description, setDescription] = useState(location.state?.description || "");
  const [image, setImage] = useState(location.state?.image || []);
  const [labelPrice, setLabelPrice] = useState(location.state?.labalPrice ?? location.state?.labelPrice ?? "");
  const [stock, setStock] = useState(location.state?.stock ?? "");
  const [isAvailable, setIsAvailable] = useState(location.state?.isAvailable ?? true);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!location.state);

  useEffect(() => {
    if (location.state) {
      const p = location.state;
      setProductId(p.productId || urlProductId || "");
      setName(p.name || "");
      setAltName(Array.isArray(p.altName) ? p.altName : []);
      setPrice(p.price ?? "");
      setDescription(p.description || "");
      setImage(Array.isArray(p.image) ? p.image : []);
      setLabelPrice(p.labalPrice ?? p.labelPrice ?? "");
      setStock(p.stock ?? "");
      setIsAvailable(p.isAvailable ?? true);
      setFetching(false);
      return;
    }

    if (urlProductId) {
      async function fetchProduct() {
        const token = localStorage.getItem("token");
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, "")}/api/products/${urlProductId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const p = res.data.product || res.data;
          if (p) {
            setProductId(p.productId || urlProductId);
            setName(p.name || "");
            setAltName(Array.isArray(p.altName) ? p.altName : []);
            setPrice(p.price ?? "");
            setDescription(p.description || "");
            setImage(Array.isArray(p.image) ? p.image : []);
            setLabelPrice(p.labalPrice ?? p.labelPrice ?? "");
            setStock(p.stock ?? "");
            setIsAvailable(p.isAvailable ?? true);
          }
        } catch (err) {
          console.error("Failed to fetch product:", err);
          toast.error("Failed to load product details");
        } finally {
          setFetching(false);
        }
      }

      fetchProduct();
    } else {
      setFetching(false);
    }
  }, [location.state, urlProductId]);

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
      toast.error("Please enter a valid stock count");
      return;
    }

    if (!image || image.length === 0) {
      toast.error("Please keep or upload at least one image");
      return;
    }

    try {
      setLoading(true);

      // 1. Upload new image files if any
      const imageUrls = await Promise.all(
        image.map(async (item) => {
          if (typeof item === "string") {
            return item; // Existing image URL
          }
          return await mediaUpload(item); // New image File uploaded to Supabase
        })
      );

      // 2. Prepare product data according to backend requirements
      const productData = {
        productId: productId.trim(),
        name: name.trim(),
        altName: altName,
        price: Number(price),
        description: description.trim(),
        image: imageUrls,
        labalPrice: Number(labelPrice),
        stock: Number(stock),
        isAvailable: isAvailable,
      };

      const targetId = location.state?._id || location.state?.productId || urlProductId || productId.trim();

      // 3. Send PUT request to backend
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, "")}/api/products/${targetId}`,
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
      console.error("========== UPDATE PRODUCT ERROR ==========", error);
      const message =
        error?.response?.data?.error?.message ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update product";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  const handleRemoveImage = (indexToRemove) => {
    setImage((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <p className="text-[#FF8A75] text-lg">Loading product details...</p>
      </div>
    );
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
          Edit Product
        </h1>

        <p className="text-sm text-gray-300 text-center mb-8">
          Update your product details
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Product ID */}
          <Input
            label="Product ID"
            disabled
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
            value={Array.isArray(altName) ? altName.join(", ") : altName}
            onChange={(value) => {
              const names = value
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean);
              setAltName(names);
            }}
            placeholder="Example: Shirt, T-Shirt"
          />

          {/* Price & Label Price */}
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
            <label className="text-sm text-gray-300">Description</label>
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description"
              className="w-full mt-1 px-4 py-3 rounded-xl bg-[#1C1C1C] text-white placeholder-gray-500 border border-[#8B1A24] focus:ring-2 focus:ring-[#FF8A75] focus:outline-none"
            />
          </div>

          {/* Product Images */}
          <div>
            <label className="text-sm text-gray-300">Product Images</label>

            {/* Existing / Selected Image Previews */}
            {image && image.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-3 mb-3">
                {image.map((imgItem, idx) => {
                  const src =
                    typeof imgItem === "string"
                      ? imgItem
                      : URL.createObjectURL(imgItem);
                  return (
                    <div key={idx} className="relative group w-20 h-20">
                      <img
                        src={src}
                        alt={`Preview ${idx}`}
                        className="w-20 h-20 object-cover rounded-xl border border-[#FF8A75]"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow hover:bg-red-700"
                        title="Remove image"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                setImage((prev) => [...(Array.isArray(prev) ? prev : []), ...files]);
              }}
              className="w-full mt-2 text-sm text-gray-300"
            />
            {image.length > 0 && (
              <p className="text-xs text-gray-400 mt-1">
                {image.length} image(s) attached
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
                onChange={(e) => setIsAvailable(e.target.checked)}
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
              {loading ? "Updating Product..." : "Update Product"}
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
      <label className="text-sm text-gray-300">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1 px-4 py-3 rounded-xl bg-[#1C1C1C] text-white placeholder-gray-500 border border-[#8B1A24] focus:ring-2 focus:ring-[#FF8A75] focus:border-[#FF8A75] focus:outline-none transition"
      />
    </div>
  );
}