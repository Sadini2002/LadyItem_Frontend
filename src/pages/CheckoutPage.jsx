import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Phone,
  User,
  ShieldCheck,
  Truck,
  Tag,
  Sparkles,
} from "lucide-react";
import { useCart } from "../context/CartContext";

const DEFAULT_PLACEHOLDER =
  "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22200%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%231F2937%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22%239CA3AF%22%20font-family%3D%22sans-serif%22%20font-size%3D%2216%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E";

// Step indicator component
function StepBar({ current }) {
  const steps = ["Cart", "Checkout", "Payment", "Confirmation"];
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((step, i) => {
        const idx = i + 1;
        const done = idx < current;
        const active = idx === current;
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${done
                    ? "bg-[#8B1A24] border-[#8B1A24] text-white"
                    : active
                      ? "bg-[#8B1A24]/20 border-[#FF8A75] text-[#FF8A75]"
                      : "bg-white/5 border-white/20 text-gray-500"
                  }`}
              >
                {done ? "✓" : idx}
              </div>
              <span
                className={`text-[10px] mt-1 font-medium ${active ? "text-[#FF8A75]" : done ? "text-gray-300" : "text-gray-600"
                  }`}
              >
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-16 h-px mb-5 mx-1 ${done ? "bg-[#8B1A24]" : "bg-white/10"
                  }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, subtotal, discountCode, discountPercentage, discountAmount, shippingFee, grandTotal } =
    useCart();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Your cart is empty.</p>
          <Link
            to="/products"
            className="px-6 py-3 bg-[#8B1A24] rounded-full font-semibold hover:bg-[#A61F2C] transition"
          >
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = "Required";
    if (!form.lastName.trim()) newErrors.lastName = "Required";
    if (!form.phone.trim()) newErrors.phone = "Required";
    else if (!/^[0-9+\-\s]{10,15}$/.test(form.phone.trim()))
      newErrors.phone = "Enter a valid phone number";
    if (!form.email.trim()) newErrors.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Invalid email";
    if (!form.address.trim()) newErrors.address = "Required";
    if (!form.city.trim()) newErrors.city = "Required";
    if (!form.postalCode.trim()) newErrors.postalCode = "Required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    // Save checkout data to sessionStorage for the payment page
    sessionStorage.setItem(
      "checkout_data",
      JSON.stringify({
        ...form,
        subtotal,
        discountCode,
        discountPercentage,
        discountAmount,
        shippingFee,
        grandTotal,
        cartSnapshot: cart,
      })
    );
    navigate("/payment");
  };

  const inputCls = (field) =>
    `w-full px-4 py-3 rounded-xl bg-white/5 border ${errors[field] ? "border-red-500" : "border-white/15"
    } text-white placeholder-gray-500 focus:outline-none focus:border-[#FF8A75] focus:ring-1 focus:ring-[#FF8A75]/40 transition text-sm`;

  return (
    <div className="min-h-screen w-full bg-[#121212] pt-28 pb-16 px-4 md:px-10 text-white relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-[#8B1A24]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-[#FF8A75]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Title */}
        <div className="mb-2 flex items-center gap-2 text-[#FF8A75] text-xs font-semibold uppercase tracking-widest">
          <Sparkles size={14} />
          Step 2 of 4
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-8 tracking-tight">
          Delivery Details
        </h1>

        <StepBar current={2} />

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* ── LEFT: Address Form ── */}
            <div className="lg:col-span-7 space-y-5">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
                <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                  <MapPin size={18} className="text-[#FF8A75]" />
                  Shipping Address
                </h2>

                {/* Name row */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={form.firstName}
                      onChange={handleChange}
                      placeholder="Sara"
                      className={inputCls("firstName")}
                    />
                    {errors.firstName && (
                      <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={form.lastName}
                      onChange={handleChange}
                      placeholder="Khan"
                      className={inputCls("lastName")}
                    />
                    {errors.lastName && (
                      <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Phone + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                      />
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+92 300 0000000"
                        className={`${inputCls("phone")} pl-9`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="sara@example.com"
                      className={inputCls("email")}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Street Address */}
                <div className="mb-4">
                  <label className="text-xs text-gray-400 mb-1.5 block">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="House #5, Street 12, Block C"
                    className={inputCls("address")}
                  />
                  {errors.address && (
                    <p className="text-red-400 text-xs mt-1">{errors.address}</p>
                  )}
                </div>

                {/* City + Postal */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="Lahore"
                      className={inputCls("city")}
                    />
                    {errors.city && (
                      <p className="text-red-400 text-xs mt-1">{errors.city}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={form.postalCode}
                      onChange={handleChange}
                      placeholder="54000"
                      className={inputCls("postalCode")}
                    />
                    {errors.postalCode && (
                      <p className="text-red-400 text-xs mt-1">{errors.postalCode}</p>
                    )}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">
                    Order Notes (optional)
                  </label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Any special instructions for delivery..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF8A75] focus:ring-1 focus:ring-[#FF8A75]/40 transition text-sm resize-none"
                  />
                </div>
              </div>

              {/* Guarantees */}
              <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-[#FF8A75]" />
                  Secure 256-bit SSL
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={14} className="text-[#FF8A75]" />
                  Free shipping over Rs. 5,000
                </div>
              </div>
            </div>

            {/* ── RIGHT: Order Summary ── */}
            <div className="lg:col-span-5">
              <div className="bg-white/5 border border-[#FF8A75]/20 rounded-3xl p-6 backdrop-blur-xl sticky top-28 shadow-2xl">
                <h3 className="text-lg font-bold text-white mb-4 pb-3 border-b border-white/10 flex items-center justify-between">
                  <span>Order Summary</span>
                  <span className="text-xs text-gray-400 font-normal">
                    {cart.length} item{cart.length > 1 ? "s" : ""}
                  </span>
                </h3>

                {/* Items list */}
                <div className="space-y-3 mb-5 max-h-56 overflow-y-auto pr-1 custom-scroll">
                  {cart.map((item) => {
                    const pId = item.productId || item._id;
                    const imgSrc =
                      Array.isArray(item.image) && item.image.length > 0
                        ? item.image[0]
                        : typeof item.image === "string"
                          ? item.image
                          : DEFAULT_PLACEHOLDER;
                    return (
                      <div key={pId} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-900 border border-white/10 flex-shrink-0">
                          <img
                            src={imgSrc}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = DEFAULT_PLACEHOLDER;
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white line-clamp-1">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            Qty: {item.quantity || 1}
                          </p>
                        </div>
                        <span className="text-sm font-bold text-[#FF8A75] flex-shrink-0">
                          Rs. {(Number(item.price) * (item.quantity || 1)).toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Totals */}
                <div className="space-y-2 text-sm text-gray-300 border-t border-white/10 pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-white font-medium">
                      Rs. {subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {shippingFee === 0 ? (
                        <strong className="text-green-400">FREE</strong>
                      ) : (
                        `Rs. ${shippingFee}`
                      )}
                    </span>
                  </div>
                  {discountPercentage > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span className="flex items-center gap-1">
                        <Tag size={12} /> {discountCode} ({discountPercentage}% off)
                      </span>
                      <span>- Rs. {discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-baseline pt-3 border-t border-white/10">
                    <span className="font-bold text-white">Grand Total</span>
                    <span className="text-2xl font-black text-[#FF8A75]">
                      Rs. {grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-6 space-y-3">
                  <button
                    type="submit"
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#8B1A24] to-[#C94050] hover:from-[#A61F2C] hover:to-[#D94555] text-white font-bold text-base flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-[#8B1A24]/30 hover:scale-[1.01]"
                  >
                    Continue to Payment
                    <ArrowRight size={18} />
                  </button>

                  <Link
                    to="/cart"
                    className="w-full py-3 rounded-2xl border border-white/15 text-gray-400 hover:text-white hover:border-white/30 text-sm font-medium flex items-center justify-center gap-2 transition"
                  >
                    <ArrowLeft size={15} />
                    Back to Cart
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
