import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  ShoppingBag,
  MapPin,
  ClipboardList,
  Truck,
  Calendar,
  ChevronRight,
} from "lucide-react";

const DEFAULT_PLACEHOLDER =
  "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22200%22%20height%3D%22200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20fill%3D%22%231F2937%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20fill%3D%22%239CA3AF%22%20font-family%3D%22sans-serif%22%20font-size%3D%2216%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E";

const methodLabels = {
  card: "Credit / Debit Card",
  easypaisa: "EasyPaisa",
  cod: "Cash on Delivery",
};

export default function OrderConfirmationPage() {
  const [order, setOrder] = useState(null);
  const [animIn, setAnimIn] = useState(false);
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("last_order");
      if (stored) setOrder(JSON.parse(stored));
    } catch {
      // nothing
    }
    // trigger entrance animation
    setTimeout(() => setAnimIn(true), 80);

    // generate confetti pieces
    setConfetti(
      Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 1.5,
        dur: 2.5 + Math.random() * 2,
        color: ["#FF8A75", "#8B1A24", "#FFD700", "#C94050", "#FF6B6B"][i % 5],
        size: 6 + Math.random() * 8,
      }))
    );
  }, []);

  if (!order) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <p className="text-gray-400">No order found.</p>
          <Link
            to="/products"
            className="px-6 py-3 bg-[#8B1A24] rounded-full font-semibold hover:bg-[#A61F2C] transition inline-block"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  const { orderId, deliveryDate, method, items, subtotal, discountCode, discountAmount, shippingFee, grandTotal, address } = order;

  return (
    <div className="min-h-screen w-full bg-[#121212] pt-20 pb-16 px-4 md:px-10 text-white relative overflow-hidden">
      {/* Glow blobs */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-[#8B1A24]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-[#FF8A75]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#8B1A24]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Confetti */}
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute top-0 rounded-sm pointer-events-none"
          style={{
            left: `${piece.left}%`,
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            animation: `confettiFall ${piece.dur}s ease-in ${piece.delay}s forwards`,
            opacity: 0,
          }}
        />
      ))}

      <div className="max-w-3xl mx-auto relative z-10">
        {/* ── Success Icon & Headline ── */}
        <div
          className={`text-center mb-10 transition-all duration-700 ${
            animIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Animated checkmark ring */}
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="w-28 h-28 rounded-full bg-[#8B1A24]/20 border-2 border-[#8B1A24]/40 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#8B1A24] to-[#C94050] flex items-center justify-center shadow-2xl shadow-[#8B1A24]/40">
                <CheckCircle2 size={40} className="text-white" strokeWidth={2.5} />
              </div>
            </div>
            {/* Ping ring */}
            <div className="absolute inset-0 rounded-full border-2 border-[#FF8A75]/30 animate-ping" />
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
            Order{" "}
            <span className="bg-gradient-to-r from-[#FF8A75] to-[#8B1A24] bg-clip-text text-transparent">
              Confirmed!
            </span>
          </h1>
          <p className="text-gray-300 text-lg max-w-md mx-auto">
            Thank you for shopping with LadyItem. Your order has been placed successfully. 🎉
          </p>

          {/* Order ID badge */}
          <div className="inline-flex items-center gap-2 mt-4 bg-white/5 border border-[#FF8A75]/30 px-5 py-2.5 rounded-full text-sm">
            <ClipboardList size={15} className="text-[#FF8A75]" />
            <span className="text-gray-400">Order ID:</span>
            <span className="font-bold text-white font-mono">{orderId}</span>
          </div>
        </div>

        {/* ── Info Cards Row ── */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 transition-all duration-700 delay-150 ${
            animIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {/* Estimated delivery */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#8B1A24]/20 flex items-center justify-center flex-shrink-0">
              <Calendar size={16} className="text-[#FF8A75]" />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Estimated Delivery</p>
              <p className="text-sm font-bold text-white">{deliveryDate}</p>
            </div>
          </div>

          {/* Payment method */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#8B1A24]/20 flex items-center justify-center flex-shrink-0">
              <Truck size={16} className="text-[#FF8A75]" />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Payment Method</p>
              <p className="text-sm font-bold text-white">{methodLabels[method] || method}</p>
            </div>
          </div>

          {/* Shipping address */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#8B1A24]/20 flex items-center justify-center flex-shrink-0">
              <MapPin size={16} className="text-[#FF8A75]" />
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Delivering To</p>
              <p className="text-sm font-bold text-white">
                {address?.firstName} {address?.lastName}
              </p>
              <p className="text-xs text-gray-400">{address?.city}</p>
            </div>
          </div>
        </div>

        {/* ── Order Items ── */}
        <div
          className={`bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl mb-6 transition-all duration-700 delay-300 ${
            animIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <ShoppingBag size={16} className="text-[#FF8A75]" />
            Items Ordered ({items?.length})
          </h2>

          <div className="space-y-4">
            {items?.map((item) => {
              const pId = item.productId || item._id;
              const imgSrc =
                Array.isArray(item.image) && item.image.length > 0
                  ? item.image[0]
                  : typeof item.image === "string"
                  ? item.image
                  : DEFAULT_PLACEHOLDER;
              return (
                <div key={pId} className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-900 border border-white/10 flex-shrink-0">
                    <img
                      src={imgSrc}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.src = DEFAULT_PLACEHOLDER; }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white line-clamp-1">{item.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity || 1}</p>
                  </div>
                  <span className="text-sm font-bold text-[#FF8A75] flex-shrink-0">
                    Rs. {(Number(item.price) * (item.quantity || 1)).toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Totals */}
          <div className="mt-5 pt-4 border-t border-white/10 space-y-1.5 text-sm text-gray-300">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-white">Rs. {Number(subtotal).toLocaleString()}</span>
            </div>
            {Number(discountAmount) > 0 && (
              <div className="flex justify-between text-green-400">
                <span>Discount ({discountCode})</span>
                <span>- Rs. {Number(discountAmount).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{Number(shippingFee) === 0 ? <strong className="text-green-400">FREE</strong> : `Rs. ${shippingFee}`}</span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-white/10">
              <span className="font-bold text-white text-base">Total Paid</span>
              <span className="text-xl font-black text-[#FF8A75]">
                Rs. {Number(grandTotal).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* ── Status Timeline ── */}
        <div
          className={`bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl mb-8 transition-all duration-700 delay-[450ms] ${
            animIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-base font-bold text-white mb-5">Order Status</h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-3.5 top-0 bottom-0 w-px bg-gradient-to-b from-[#8B1A24] via-[#FF8A75]/30 to-transparent" />
            {[
              { label: "Order Placed", done: true, time: "Just now" },
              { label: "Payment Confirmed", done: true, time: "Just now" },
              { label: "Processing", done: false, time: "~1 hour" },
              { label: "Shipped", done: false, time: "Within 2 days" },
              { label: "Delivered", done: false, time: deliveryDate },
            ].map((step, i) => (
              <div key={step.label} className={`flex items-center gap-4 ${i > 0 ? "mt-5" : ""}`}>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border-2 z-10 relative transition-all ${
                    step.done
                      ? "bg-[#8B1A24] border-[#8B1A24] text-white"
                      : "bg-[#0d0507] border-white/20 text-gray-600"
                  }`}
                >
                  {step.done ? (
                    <CheckCircle2 size={14} strokeWidth={2.5} />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-gray-600" />
                  )}
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <span className={`text-sm font-medium ${step.done ? "text-white" : "text-gray-500"}`}>
                    {step.label}
                  </span>
                  <span className="text-xs text-gray-500">{step.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA Buttons ── */}
        <div
          className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-500 ${
            animIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Link
            to="/products"
            className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-[#8B1A24] to-[#C94050] hover:from-[#A61F2C] hover:to-[#D94555] text-white font-bold text-base flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:scale-[1.01]"
          >
            <ShoppingBag size={18} />
            Continue Shopping
            <ChevronRight size={16} />
          </Link>
          <Link
            to="/"
            className="flex-1 py-4 rounded-2xl border border-white/15 text-gray-300 hover:text-white hover:border-white/30 font-semibold text-base flex items-center justify-center gap-2 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>

      {/* Confetti keyframe */}
      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(-20px) rotate(0deg);   opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
