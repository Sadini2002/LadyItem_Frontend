import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Search, ShoppingBag, Heart, Eye, Sparkles } from "lucide-react";
import { useCart } from "../context/CartContext";

const DEFAULT_PLACEHOLDER =
  "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22400%22%20height%3D%22400%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%231F2937%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22%239CA3AF%22%20font-family%3D%22sans-serif%22%20font-size%3D%2220%22%3ENo%20Image%20Available%3C%2Ftext%3E%3C%2Fsvg%3E";

export default function ProductPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImageModal, setSelectedImageModal] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, "")}/api/products`
        );
        setProducts(res.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products from database");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Filter products by name or productId
  const filteredProducts = products.filter((item) => {
    const q = searchQuery.toLowerCase();
    const nameMatch = item.name?.toLowerCase().includes(q);
    const idMatch = item.productId?.toLowerCase().includes(q);
    const altMatch = Array.isArray(item.altName) && item.altName.some((alt) => alt.toLowerCase().includes(q));
    return nameMatch || idMatch || altMatch;
  });

  return (
    <div className="min-h-screen w-full bg-[#121212] pt-28 pb-16 px-4 md:px-10 text-white relative overflow-hidden">
      {/* Background Glow Accents */}
      <div className="absolute top-[-100px] left-[-100px] w-[350px] h-[350px] bg-[#8B1A24]/25 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[350px] h-[350px] bg-[#FF8A75]/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-[#FF8A75] font-semibold text-sm mb-1">
              <Sparkles size={18} />
              <span>COLLECTION</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-[#FF8A75] bg-clip-text text-transparent">
              All Products
            </h1>
            <p className="text-gray-400 text-sm md:text-base mt-1">
              Explore our complete collection of handcrafted fashion items
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or product ID..."
              className="w-full pl-11 pr-4 py-3 rounded-full bg-white/5 border border-[#FF8A75]/20 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF8A75] focus:ring-2 focus:ring-[#FF8A75]/30 backdrop-blur-md transition"
            />
          </div>
        </div>

        {/* Loading Skeleton Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-96 rounded-3xl bg-white/5 border border-white/10 animate-pulse p-4 flex flex-col justify-between"
              >
                <div className="w-full h-48 bg-white/10 rounded-2xl"></div>
                <div className="space-y-3 mt-4">
                  <div className="h-5 bg-white/10 rounded w-3/4"></div>
                  <div className="h-4 bg-white/10 rounded w-1/2"></div>
                  <div className="h-8 bg-white/10 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          /* Products Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const imageSrc =
                Array.isArray(product.image) && product.image.length > 0 && product.image[0]
                  ? product.image[0]
                  : DEFAULT_PLACEHOLDER;

              const hasDiscount =
                product.labalPrice && Number(product.labalPrice) > Number(product.price);

              const pId = product.productId || product._id;

              return (
                <div
                  key={pId}
                  className="group relative bg-white/5 backdrop-blur-xl rounded-3xl border border-[#FF8A75]/20 hover:border-[#FF8A75]/60 p-4 transition duration-300 flex flex-col justify-between hover:-translate-y-1 shadow-lg hover:shadow-[#8B1A24]/20 cursor-pointer"
                  onClick={() => navigate(`/products/${pId}`)}
                >
                  {/* Image Container */}
                  <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-gray-900 border border-white/10 mb-4">
                    <img
                      src={imageSrc}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = DEFAULT_PLACEHOLDER;
                      }}
                    />

                    {/* Product ID Badge */}
                    <div className="absolute top-3 left-3 bg-[#8B1A24]/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full border border-white/20 backdrop-blur-md">
                      ID: {product.productId}
                    </div>

                    {/* Stock Status */}
                    <div
                      className={`absolute top-3 right-3 text-xs font-semibold px-2 py-0.5 rounded-full border backdrop-blur-md ${
                        product.stock > 0
                          ? "bg-green-500/20 border-green-500/40 text-green-400"
                          : "bg-red-500/20 border-red-500/40 text-red-400"
                      }`}
                    >
                      {product.stock > 0 ? `${product.stock} left` : "Out of Stock"}
                    </div>

                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImageModal(imageSrc);
                        }}
                        className="p-3 bg-white/20 hover:bg-[#8B1A24] text-white rounded-full transition transform hover:scale-110"
                        title="Quick View"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.success(`Added ${product.name} to wishlist`);
                        }}
                        className="p-3 bg-white/20 hover:bg-[#FF8A75] text-white rounded-full transition transform hover:scale-110"
                        title="Wishlist"
                      >
                        <Heart size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-[#FF8A75] transition line-clamp-1">
                        {product.name}
                      </h3>

                      {product.description && (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                      {/* Price Section */}
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold text-[#FF8A75]">
                            Rs. {product.price}
                          </span>
                          {hasDiscount && (
                            <span className="text-xs text-gray-400 line-through">
                              Rs. {product.labalPrice}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        disabled={product.stock <= 0}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#8B1A24] text-white hover:bg-[#A61F2C] disabled:bg-gray-700 disabled:cursor-not-allowed transition text-sm font-medium shadow-md"
                      >
                        <ShoppingBag size={16} />
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20 bg-white/5 backdrop-blur-xl rounded-3xl border border-[#FF8A75]/20 p-8 max-w-lg mx-auto">
            <ShoppingBag className="mx-auto text-gray-500 mb-4" size={48} />
            <h3 className="text-xl font-bold text-[#FF8A75] mb-2">No Products Found</h3>
            <p className="text-gray-400 text-sm">
              {searchQuery
                ? `No products matched your search "${searchQuery}".`
                : "There are currently no products available in the database."}
            </p>
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {selectedImageModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedImageModal(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-[#1C1C1C] border border-[#FF8A75]/40 rounded-3xl p-4 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImageModal(null)}
              className="absolute top-4 right-4 bg-white/20 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition"
            >
              ✕
            </button>
            <img
              src={selectedImageModal}
              alt="Preview"
              className="w-full max-h-[75vh] object-contain rounded-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
