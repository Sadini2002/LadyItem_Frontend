import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Tag,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Sparkles,
  X,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const DEFAULT_PLACEHOLDER =
  "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22200%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%231F2937%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22%239CA3AF%22%20font-family%3D%22sans-serif%22%20font-size%3D%2216%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E";

export default function CartPage() {
  const navigate = useNavigate();
  const {
    cart,
    cartCount,
    subtotal,
    discountCode,
    discountPercentage,
    discountAmount,
    shippingFee,
    grandTotal,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyPromoCode,
    removePromoCode,
  } = useCart();

  const [inputPromo, setInputPromo] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!inputPromo.trim()) return;
    const success = applyPromoCode(inputPromo);
    if (success) {
      setInputPromo("");
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };


  return (
    <div className="min-h-screen w-full bg-[#121212] pt-28 pb-16 px-4 md:px-10 text-white relative overflow-hidden">
      {/* Glow Accents */}
      <div className="absolute top-[-100px] left-[-100px] w-[350px] h-[350px] bg-[#8B1A24]/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[350px] h-[350px] bg-[#FF8A75]/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-[#FF8A75] font-semibold text-xs uppercase tracking-wider mb-1">
              <Sparkles size={16} />
              <span>SHOPPING BAG</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Your Cart ({cartCount} {cartCount === 1 ? "Item" : "Items"})
            </h1>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md transition group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Continue Shopping
          </Link>
        </div>

        {cart.length === 0 ? (
          /* Empty Cart View */
          <div className="bg-white/5 backdrop-blur-xl border border-[#FF8A75]/20 rounded-3xl p-12 text-center max-w-lg mx-auto my-12 shadow-2xl">
            <div className="w-20 h-20 bg-[#8B1A24]/20 border border-[#8B1A24]/40 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={36} className="text-[#FF8A75]" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Your Cart is Empty
            </h2>
            <p className="text-gray-400 text-sm mb-8">
              Looks like you haven't added any items to your cart yet. Explore our handcrafted fashion collection today!
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#8B1A24] hover:bg-[#A61F2C] text-white font-bold transition shadow-lg hover:shadow-[#8B1A24]/30"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          /* Cart Content Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <span>Product Items</span>
                <button
                  onClick={clearCart}
                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition"
                >
                  <Trash2 size={14} /> Clear All
                </button>
              </div>

              {cart.map((item) => {
                const itemPId = item.productId || item._id;
                const imageSrc =
                  Array.isArray(item.image) && item.image.length > 0 && item.image[0]
                    ? item.image[0]
                    : typeof item.image === "string"
                    ? item.image
                    : DEFAULT_PLACEHOLDER;

                const itemPrice = Number(item.price) || 0;
                const itemTotal = itemPrice * (item.quantity || 1);

                return (
                  <div
                    key={itemPId}
                    className="bg-white/5 border border-white/10 hover:border-[#FF8A75]/40 rounded-3xl p-4 md:p-5 backdrop-blur-xl transition duration-300 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md"
                  >
                    {/* Thumbnail & Info */}
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <Link
                        to={`/products/${itemPId}`}
                        className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-gray-900 border border-white/10 flex-shrink-0"
                      >
                        <img
                          src={imageSrc}
                          alt={item.name}
                          className="w-full h-full object-cover hover:scale-105 transition"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = DEFAULT_PLACEHOLDER;
                          }}
                        />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/products/${itemPId}`}
                          className="text-base md:text-lg font-bold text-white hover:text-[#FF8A75] transition line-clamp-1 block"
                        >
                          {item.name}
                        </Link>

                        <div className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                          <span className="bg-[#8B1A24]/30 border border-[#8B1A24]/50 text-white px-2 py-0.5 rounded-full font-mono text-[10px]">
                            ID: {item.productId || item._id}
                          </span>
                          <span>Unit: Rs. {itemPrice.toLocaleString()}</span>
                        </div>

                        {item.stock !== undefined && (
                          <span
                            className={`text-[11px] mt-1 inline-block ${
                              item.stock > 0 ? "text-green-400" : "text-red-400"
                            }`}
                          >
                            {item.stock > 0 ? "In Stock" : "Out of Stock"}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls & Price */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-white/10">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-white/20 bg-white/5 rounded-2xl p-1 backdrop-blur-md">
                        <button
                          onClick={() => updateQuantity(itemPId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/10 text-white disabled:opacity-30 transition"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(itemPId, item.quantity + 1)}
                          disabled={item.stock > 0 && item.quantity >= item.stock}
                          className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/10 text-white disabled:opacity-30 transition"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Total Item Price */}
                      <div className="text-right min-w-[90px]">
                        <span className="text-base md:text-lg font-bold text-[#FF8A75]">
                          Rs. {itemTotal.toLocaleString()}
                        </span>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => removeFromCart(itemPId)}
                        className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition"
                        title="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-white/5 border border-[#FF8A75]/20 rounded-3xl p-6 backdrop-blur-xl sticky top-28 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-4 pb-3 border-b border-white/10 flex items-center justify-between">
                  <span>Order Summary</span>
                  <Tag size={18} className="text-[#FF8A75]" />
                </h3>

                {/* Pricing List */}
                <div className="space-y-3 text-sm text-gray-300 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-white">
                      Rs. {subtotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Estimated Shipping</span>
                    <span>
                      {shippingFee === 0 ? (
                        <strong className="text-green-400 font-semibold">FREE</strong>
                      ) : (
                        `Rs. ${shippingFee}`
                      )}
                    </span>
                  </div>

                  {discountPercentage > 0 && (
                    <div className="flex justify-between text-green-400 font-medium bg-green-500/10 border border-green-500/20 p-2 rounded-xl">
                      <span className="flex items-center gap-1">
                        <Tag size={14} /> Discount ({discountCode})
                      </span>
                      <span>- Rs. {discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-white/10 flex justify-between items-baseline text-white">
                    <span className="text-base font-bold">Grand Total</span>
                    <span className="text-2xl font-black text-[#FF8A75]">
                      Rs. {grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Promo Code Form */}
                <div className="mb-6">
                  <label className="text-xs font-semibold text-gray-400 block mb-2">
                    PROMO CODE (e.g. LADY10)
                  </label>
                  {discountCode ? (
                    <div className="flex items-center justify-between bg-white/10 border border-[#FF8A75]/40 rounded-2xl px-4 py-2 text-sm text-[#FF8A75]">
                      <span className="font-bold flex items-center gap-2">
                        <CheckCircle2 size={16} /> {discountCode} ({discountPercentage}% OFF)
                      </span>
                      <button
                        onClick={removePromoCode}
                        className="text-gray-400 hover:text-white transition p-1"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyPromo} className="flex gap-2">
                      <input
                        type="text"
                        value={inputPromo}
                        onChange={(e) => setInputPromo(e.target.value)}
                        placeholder="Enter code"
                        className="flex-1 bg-white/5 border border-white/20 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF8A75] transition"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 bg-white/10 hover:bg-[#8B1A24] border border-white/20 rounded-2xl text-xs font-bold text-white transition"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full py-4 rounded-2xl bg-[#8B1A24] hover:bg-[#A61F2C] text-white font-bold text-base flex items-center justify-center gap-2 transition duration-300 shadow-lg hover:shadow-[#8B1A24]/30 disabled:opacity-50"
                >
                  {isCheckingOut ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <ShoppingBag size={18} />
                      Proceed to Checkout
                    </>
                  )}
                </button>

                {/* Guarantees */}
                <div className="mt-6 pt-4 border-t border-white/10 space-y-2 text-xs text-gray-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-[#FF8A75]" />
                    <span>Secure 256-bit SSL Checkout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck size={14} className="text-[#FF8A75]" />
                    <span>Free shipping on orders over Rs. 5,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
