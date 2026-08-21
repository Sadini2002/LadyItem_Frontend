import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Smartphone,
  Package,
  ShieldCheck,
  Truck,
  Tag,
  Lock,
  Sparkles,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

// Step indicator (same as checkout)
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
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${
                  done
                    ? "bg-[#8B1A24] border-[#8B1A24] text-white"
                    : active
                    ? "bg-[#8B1A24]/20 border-[#FF8A75] text-[#FF8A75]"
                    : "bg-white/5 border-white/20 text-gray-500"
                }`}
              >
                {done ? "✓" : idx}
              </div>
              <span
                className={`text-[10px] mt-1 font-medium ${
                  active ? "text-[#FF8A75]" : done ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-16 h-px mb-5 mx-1 ${
                  done ? "bg-[#8B1A24]" : "bg-white/10"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Format card number with spaces every 4 digits
function formatCardNumber(val) {
  return val
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

// Format expiry as MM/YY
function formatExpiry(val) {
  const digits = val.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
  return digits;
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const { cart, subtotal, discountCode, discountPercentage, discountAmount, shippingFee, grandTotal, clearCart } =
    useCart();

  const checkoutData = (() => {
    try {
      return JSON.parse(sessionStorage.getItem("checkout_data") || "{}");
    } catch {
      return {};
    }
  })();

  const [method, setMethod] = useState("card"); // "card" | "easypaisa" | "cod"
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "", name: "" });
  const [easyPhone, setEasyPhone] = useState("");
  const [placing, setPlacing] = useState(false);
  const [cardErrors, setCardErrors] = useState({});

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Nothing to pay for.</p>
          <Link to="/products" className="px-6 py-3 bg-[#8B1A24] rounded-full font-semibold hover:bg-[#A61F2C] transition">
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  const validateCard = () => {
    const errs = {};
    const digits = card.number.replace(/\s/g, "");
    if (digits.length < 16) errs.number = "Enter a valid 16-digit card number";
    if (!card.name.trim()) errs.name = "Cardholder name required";
    const expiryParts = card.expiry.split("/");
    if (expiryParts.length !== 2 || expiryParts[0].length !== 2 || expiryParts[1].length !== 2)
      errs.expiry = "Enter valid expiry (MM/YY)";
    if (card.cvv.length < 3) errs.cvv = "Enter valid CVV";
    return errs;
  };

  const handlePlaceOrder = () => {
    if (method === "card") {
      const errs = validateCard();
      if (Object.keys(errs).length > 0) {
        setCardErrors(errs);
        return;
      }
    }
    if (method === "easypaisa" && easyPhone.replace(/\D/g, "").length < 10) {
      toast.error("Enter a valid EasyPaisa mobile number");
      return;
    }

    setPlacing(true);

    // Generate order ID and save snapshot
    const orderId = "LI-" + new Date().getFullYear() + "-" + Math.random().toString(36).slice(2, 7).toUpperCase();
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);

    const orderSnapshot = {
      orderId,
      deliveryDate: deliveryDate.toDateString(),
      method,
      items: cart,
      subtotal,
      discountCode,
      discountAmount,
      shippingFee,
      grandTotal,
      address: checkoutData,
      placedAt: new Date().toISOString(),
    };

    sessionStorage.setItem("last_order", JSON.stringify(orderSnapshot));

    setTimeout(() => {
      clearCart();
      sessionStorage.removeItem("checkout_data");
      navigate("/order-confirmation");
    }, 2000);
  };

  const inputCls = (field) =>
    `w-full px-4 py-3 rounded-xl bg-white/5 border ${
      cardErrors[field] ? "border-red-500" : "border-white/15"
    } text-white placeholder-gray-500 focus:outline-none focus:border-[#FF8A75] focus:ring-1 focus:ring-[#FF8A75]/40 transition text-sm`;

  const methods = [
    { id: "card", label: "Credit / Debit Card", icon: <CreditCard size={20} /> },
    { id: "easypaisa", label: "EasyPaisa", icon: <Smartphone size={20} /> },
    { id: "cod", label: "Cash on Delivery", icon: <Package size={20} /> },
  ];

  return (
    <div className="min-h-screen w-full bg-[#121212] pt-28 pb-16 px-4 md:px-10 text-white relative overflow-hidden">
      {/* Glows */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-[#8B1A24]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-[#FF8A75]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-2 flex items-center gap-2 text-[#FF8A75] text-xs font-semibold uppercase tracking-widest">
          <Sparkles size={14} />
          Step 3 of 4
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-8 tracking-tight">
          Payment
        </h1>

        <StepBar current={3} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ── LEFT: Payment Methods ── */}
          <div className="lg:col-span-7 space-y-5">
            {/* Method selector */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Lock size={18} className="text-[#FF8A75]" />
                Select Payment Method
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {methods.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`flex flex-col items-center gap-2 py-4 px-3 rounded-2xl border text-sm font-medium transition-all duration-200 ${
                      method === m.id
                        ? "border-[#FF8A75] bg-[#8B1A24]/20 text-[#FF8A75] shadow-lg shadow-[#8B1A24]/20"
                        : "border-white/15 bg-white/5 text-gray-400 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    {m.icon}
                    <span className="text-center text-xs leading-tight">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Card fields */}
            {method === "card" && (
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2">
                  <CreditCard size={16} className="text-[#FF8A75]" />
                  Card Details
                </h3>

                {/* Mock card preview */}
                <div className="relative w-full h-44 rounded-2xl bg-gradient-to-br from-[#8B1A24] via-[#A0202C] to-[#C94050] p-5 shadow-2xl overflow-hidden mb-2">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-10 translate-x-10" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-10 -translate-x-10" />
                  <div className="relative z-10 flex flex-col justify-between h-full">
                    <div className="text-white/50 text-xs font-bold uppercase tracking-widest">LadyItem Pay</div>
                    <div>
                      <div className="text-white font-mono text-xl tracking-widest mb-2">
                        {card.number || "•••• •••• •••• ••••"}
                      </div>
                      <div className="flex justify-between text-white/70 text-xs">
                        <span>{card.name || "CARDHOLDER NAME"}</span>
                        <span>{card.expiry || "MM/YY"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Cardholder Name *</label>
                  <input
                    type="text"
                    placeholder="Sara Khan"
                    value={card.name}
                    onChange={(e) => {
                      setCard({ ...card, name: e.target.value });
                      setCardErrors({ ...cardErrors, name: "" });
                    }}
                    className={inputCls("name")}
                  />
                  {cardErrors.name && <p className="text-red-400 text-xs mt-1">{cardErrors.name}</p>}
                </div>

                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Card Number *</label>
                  <input
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    value={card.number}
                    onChange={(e) => {
                      setCard({ ...card, number: formatCardNumber(e.target.value) });
                      setCardErrors({ ...cardErrors, number: "" });
                    }}
                    className={inputCls("number")}
                    maxLength={19}
                  />
                  {cardErrors.number && <p className="text-red-400 text-xs mt-1">{cardErrors.number}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block">Expiry Date *</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={card.expiry}
                      onChange={(e) => {
                        setCard({ ...card, expiry: formatExpiry(e.target.value) });
                        setCardErrors({ ...cardErrors, expiry: "" });
                      }}
                      className={inputCls("expiry")}
                      maxLength={5}
                    />
                    {cardErrors.expiry && <p className="text-red-400 text-xs mt-1">{cardErrors.expiry}</p>}
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block">CVV *</label>
                    <input
                      type="password"
                      placeholder="•••"
                      value={card.cvv}
                      onChange={(e) => {
                        setCard({ ...card, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) });
                        setCardErrors({ ...cardErrors, cvv: "" });
                      }}
                      className={inputCls("cvv")}
                      maxLength={4}
                    />
                    {cardErrors.cvv && <p className="text-red-400 text-xs mt-1">{cardErrors.cvv}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* EasyPaisa fields */}
            {method === "easypaisa" && (
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Smartphone size={16} className="text-[#FF8A75]" />
                  EasyPaisa Mobile Number
                </h3>
                <p className="text-xs text-gray-400">
                  You will receive a payment request on your registered EasyPaisa number.
                </p>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Mobile Number *</label>
                  <input
                    type="tel"
                    placeholder="0300 0000000"
                    value={easyPhone}
                    onChange={(e) => setEasyPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF8A75] focus:ring-1 focus:ring-[#FF8A75]/40 transition text-sm"
                  />
                </div>
                <div className="bg-[#FF8A75]/10 border border-[#FF8A75]/20 rounded-xl p-3 text-xs text-[#FF8A75]">
                  ℹ️ An OTP request will be sent to this number to confirm your payment.
                </div>
              </div>
            )}

            {/* COD info */}
            {method === "cod" && (
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
                <h3 className="text-base font-bold text-white flex items-center gap-2 mb-3">
                  <Package size={16} className="text-[#FF8A75]" />
                  Cash on Delivery
                </h3>
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-sm text-green-300 space-y-2">
                  <p>✅ Pay when your order arrives at your doorstep.</p>
                  <p>✅ Keep Rs. {grandTotal.toLocaleString()} ready at the time of delivery.</p>
                  <p>✅ Our delivery partner will collect the payment.</p>
                </div>
              </div>
            )}

            {/* Security badges */}
            <div className="flex flex-wrap gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-[#FF8A75]" />
                256-bit SSL Encryption
              </div>
              <div className="flex items-center gap-2">
                <Lock size={14} className="text-[#FF8A75]" />
                Secure payment processing
              </div>
            </div>
          </div>

          {/* ── RIGHT: Order Summary ── */}
          <div className="lg:col-span-5">
            <div className="bg-white/5 border border-[#FF8A75]/20 rounded-3xl p-6 backdrop-blur-xl sticky top-28 shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-4 pb-3 border-b border-white/10">
                Order Summary
              </h3>

              {/* Delivery to */}
              {checkoutData.firstName && (
                <div className="mb-4 bg-white/5 rounded-2xl px-4 py-3 text-xs text-gray-300 border border-white/10">
                  <p className="text-gray-400 uppercase tracking-widest text-[10px] mb-1">Delivering to</p>
                  <p className="font-semibold text-white">
                    {checkoutData.firstName} {checkoutData.lastName}
                  </p>
                  <p>{checkoutData.address}, {checkoutData.city} {checkoutData.postalCode}</p>
                </div>
              )}

              {/* Items */}
              <div className="space-y-2 mb-4 max-h-44 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.productId || item._id} className="flex justify-between text-sm">
                    <span className="text-gray-300 line-clamp-1 flex-1 mr-2">
                      {item.name}{" "}
                      <span className="text-gray-500">×{item.quantity || 1}</span>
                    </span>
                    <span className="text-white font-medium flex-shrink-0">
                      Rs. {(Number(item.price) * (item.quantity || 1)).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 text-sm text-gray-300 border-t border-white/10 pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-white font-medium">Rs. {subtotal.toLocaleString()}</span>
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
                      <Tag size={12} /> Discount
                    </span>
                    <span>- Rs. {discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-3 border-t border-white/10">
                  <span className="font-bold text-white text-base">Grand Total</span>
                  <span className="text-2xl font-black text-[#FF8A75]">
                    Rs. {grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Place Order button */}
              <button
                onClick={handlePlaceOrder}
                disabled={placing}
                className="mt-6 w-full py-4 rounded-2xl bg-gradient-to-r from-[#8B1A24] to-[#C94050] hover:from-[#A61F2C] hover:to-[#D94555] text-white font-bold text-base flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-[#8B1A24]/30 disabled:opacity-60 hover:scale-[1.01]"
              >
                {placing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock size={16} />
                    Place Order · Rs. {grandTotal.toLocaleString()}
                  </>
                )}
              </button>

              <Link
                to="/checkout"
                className="mt-3 w-full py-3 rounded-2xl border border-white/15 text-gray-400 hover:text-white hover:border-white/30 text-sm font-medium flex items-center justify-center gap-2 transition"
              >
                <ArrowLeft size={15} />
                Back to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
