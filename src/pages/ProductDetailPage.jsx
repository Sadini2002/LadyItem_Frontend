import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Plus,
  Minus,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import ProductReviews from "../component/ProductReviews";

const DEFAULT_PLACEHOLDER =
  "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22600%22%20height%3D%22600%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%231F2937%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22%239CA3AF%22%20font-family%3D%22sans-serif%22%20font-size%3D%2224%22%3ENo%20Image%20Available%3C%2Ftext%3E%3C%2Fsvg%3E";

export default function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    async function fetchProductDetails() {
      try {
        setLoading(true);
        const baseUrl = (
          import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"
        ).replace(/\/+$/, "");

        let productData = null;

        // Try 1: Try fetching by productId route
        try {
          const res = await axios.get(
            `${baseUrl}/api/products/productId/${productId}`
          );
          productData = res.data;
        } catch (e) {
          // Try 2: Try fetching by MongoDB _id route
          try {
            const res2 = await axios.get(`${baseUrl}/api/products/${productId}`);
            productData = res2.data;
          } catch (err2) {
            // Try 3: Fetch all products and find match locally
            const res3 = await axios.get(`${baseUrl}/api/products`);
            const allProducts = res3.data || [];
            productData = allProducts.find(
              (p) =>
                p.productId === productId ||
                p._id === productId ||
                String(p.productId).toLowerCase() === String(productId).toLowerCase()
            );
          }
        }

        if (productData) {
          setProduct(productData);
          const images = Array.isArray(productData.image)
            ? productData.image
            : [productData.image];
          const firstValidImg =
            images.find((img) => img && typeof img === "string") ||
            DEFAULT_PLACEHOLDER;
          setSelectedImage(firstValidImg);
        } else {
          toast.error("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    }

    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity);
    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121212] pt-28 pb-16 px-4 md:px-10 text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#8B1A24] border-t-[#FF8A75] rounded-full animate-spin"></div>
          <p className="text-gray-400 font-medium text-sm">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#121212] pt-28 pb-16 px-4 md:px-10 text-white flex flex-col items-center justify-center">
        <div className="bg-white/5 backdrop-blur-xl border border-[#FF8A75]/20 rounded-3xl p-10 max-w-md w-full text-center">
          <AlertCircle className="mx-auto text-[#FF8A75] mb-4" size={48} />
          <h2 className="text-2xl font-bold text-white mb-2">Product Not Found</h2>
          <p className="text-gray-400 text-sm mb-6">
            We couldn't find the product you were looking for.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#8B1A24] hover:bg-[#A61F2C] text-white font-medium transition shadow-lg"
          >
            <ArrowLeft size={18} />
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const images = Array.isArray(product.image)
    ? product.image.filter(Boolean)
    : product.image
    ? [product.image]
    : [DEFAULT_PLACEHOLDER];

  const hasDiscount =
    product.labalPrice && Number(product.labalPrice) > Number(product.price);
  const discountPercent = hasDiscount
    ? Math.round(
        ((Number(product.labalPrice) - Number(product.price)) /
          Number(product.labalPrice)) *
          100
      )
    : 0;

  return (
    <div className="min-h-screen w-full bg-[#121212] pt-28 pb-16 px-4 md:px-10 text-white relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-[#8B1A24]/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-[#FF8A75]/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Back Navigation Bar */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition group bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm backdrop-blur-md"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span>Back to Products</span>
          </button>
        </div>

        {/* Product Details Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="relative w-full h-[400px] md:h-[500px] rounded-3xl bg-gray-900 border border-[#FF8A75]/20 overflow-hidden shadow-2xl group">
              <img
                src={selectedImage || DEFAULT_PLACEHOLDER}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = DEFAULT_PLACEHOLDER;
                }}
              />

              {/* Product ID Badge */}
              <div className="absolute top-4 left-4 bg-[#8B1A24]/90 text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-md flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#FF8A75]" />
                ID: {product.productId}
              </div>

              {/* Stock Status Badge */}
              <div
                className={`absolute top-4 right-4 text-xs font-semibold px-3 py-1.5 rounded-full border backdrop-blur-md ${
                  product.stock > 0
                    ? "bg-green-500/20 border-green-500/40 text-green-400"
                    : "bg-red-500/20 border-red-500/40 text-red-400"
                }`}
              >
                {product.stock > 0 ? `${product.stock} In Stock` : "Out of Stock"}
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => {
                  setIsWishlisted(!isWishlisted);
                  toast.success(
                    isWishlisted ? "Removed from Wishlist" : "Saved to Wishlist"
                  );
                }}
                className={`absolute bottom-4 right-4 p-3 rounded-full border backdrop-blur-md transition ${
                  isWishlisted
                    ? "bg-[#8B1A24] border-[#8B1A24] text-white"
                    : "bg-black/50 border-white/20 text-white hover:bg-[#8B1A24]"
                }`}
              >
                <Heart
                  size={20}
                  className={isWishlisted ? "fill-white" : ""}
                />
              </button>
            </div>

            {/* Thumbnail Carousel / Grid */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition flex-shrink-0 ${
                      selectedImage === img
                        ? "border-[#FF8A75] ring-2 ring-[#FF8A75]/40"
                        : "border-white/10 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumb ${idx}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = DEFAULT_PLACEHOLDER;
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details & Actions */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div>
              {/* Product Category / Tag */}
              <div className="flex items-center gap-2 text-[#FF8A75] font-semibold text-xs tracking-wider uppercase mb-2">
                <Sparkles size={14} />
                <span>Premium Collection</span>
              </div>

              {/* Product Title */}
              <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-3">
                {product.name}
              </h1>

              {/* Price & Discount Section */}
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-3xl md:text-4xl font-black text-[#FF8A75]">
                  Rs. {product.price}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-lg text-gray-500 line-through">
                      Rs. {product.labalPrice}
                    </span>
                    <span className="bg-[#8B1A24]/30 border border-[#8B1A24]/50 text-[#FF8A75] text-xs font-bold px-2.5 py-1 rounded-full">
                      SAVE {discountPercent}%
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md mb-6">
                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Description
                </h3>
                <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                  {product.description ||
                    "Elevate your wardrobe with this stylish and handcrafted piece designed for modern elegance and supreme comfort."}
                </p>
              </div>

              {/* Alternate Keywords / Tags if present */}
              {Array.isArray(product.altName) && product.altName.length > 0 && (
                <div className="mb-6">
                  <span className="text-xs font-semibold text-gray-400 block mb-2">
                    TAGS & FEATURES:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.altName.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-white/10 border border-white/15 text-gray-300 px-3 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="text-xs font-semibold text-gray-400 block mb-2 uppercase tracking-wider">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-white/20 bg-white/5 rounded-2xl p-1 backdrop-blur-md">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/10 text-white disabled:opacity-30 transition"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center text-lg font-bold text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={product.stock > 0 && quantity >= product.stock}
                      className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/10 text-white disabled:opacity-30 transition"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="text-xs text-gray-400">
                    Total: <strong className="text-[#FF8A75]">Rs. {(Number(product.price) * quantity).toLocaleString()}</strong>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-1 py-4 px-6 rounded-2xl bg-[#8B1A24] hover:bg-[#A61F2C] text-white font-bold flex items-center justify-center gap-2 transition duration-300 shadow-lg hover:shadow-[#8B1A24]/30 disabled:bg-gray-800 disabled:cursor-not-allowed"
                >
                  <ShoppingBag size={20} />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-[#FF8A75] to-[#8B1A24] hover:opacity-90 text-white font-bold flex items-center justify-center gap-2 transition duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-6 text-center text-xs text-gray-400">
                <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-white/5 border border-white/5">
                  <Truck size={20} className="text-[#FF8A75]" />
                  <span>Fast Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-white/5 border border-white/5">
                  <ShieldCheck size={20} className="text-[#FF8A75]" />
                  <span>Guaranteed Quality</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-white/5 border border-white/5">
                  <RotateCcw size={20} className="text-[#FF8A75]" />
                  <span>7 Days Return</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Product Reviews & Rating Breakdown */}
        <ProductReviews productId={product.productId || productId} productName={product.name} />
      </div>
    </div>
  );
}
