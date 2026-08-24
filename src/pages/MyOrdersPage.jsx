import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Package,
  ShoppingBag,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye,
  Calendar,
} from "lucide-react";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchMyOrders = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login to view your orders");
        return;
      }

      const response = await axios.get(
        "http://localhost:3000/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Failed to load orders:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load your orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  // ==========================================
  // STATUS STYLE
  // ==========================================
  const getStatusStyle = (status) => {
    const value = String(status || "").toLowerCase();

    switch (value) {
      case "pending":
        return {
          className:
            "bg-amber-50 text-amber-700 border border-amber-200",
          icon: <Clock size={14} />,
        };

      case "processing":
        return {
          className:
            "bg-purple-50 text-purple-700 border border-purple-200",
          icon: <Package size={14} />,
        };

      case "shipped":
        return {
          className:
            "bg-blue-50 text-blue-700 border border-blue-200",
          icon: <Truck size={14} />,
        };

      case "delivered":
        return {
          className:
            "bg-green-50 text-green-700 border border-green-200",
          icon: <CheckCircle size={14} />,
        };

      case "cancelled":
      case "canceled":
        return {
          className:
            "bg-red-50 text-red-700 border border-red-200",
          icon: <XCircle size={14} />,
        };

      default:
        return {
          className:
            "bg-gray-50 text-gray-700 border border-gray-200",
          icon: <Package size={14} />,
        };
    }
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================
  const formatDate = (date) => {
    if (!date) return "N/A";

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) {
      return "N/A";
    }

    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ==========================================
  // FORMAT MONEY
  // ==========================================
  const formatMoney = (value) => {
    return `Rs. ${(Number(value) || 0).toLocaleString(
      "en-LK",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  // ==========================================
  // PRODUCT COUNT
  // ==========================================
  const getProductCount = (order) => {
    if (!Array.isArray(order.products)) {
      return 0;
    }

    return order.products.reduce(
      (total, product) =>
        total + (Number(product.quantity) || 1),
      0
    );
  };

  return (
    <div className="min-h-screen bg-pink-50/40 px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500 flex items-center justify-center">
                <ShoppingBag
                  size={24}
                  className="text-white"
                />
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  My Orders
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  View and track your orders
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={fetchMyOrders}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-semibold transition disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={
                loading ? "animate-spin" : ""
              }
            />

            Refresh
          </button>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="bg-white rounded-2xl border border-rose-100 shadow-sm py-20 flex flex-col items-center">
            <RefreshCw
              size={30}
              className="text-rose-500 animate-spin"
            />

            <p className="text-gray-500 mt-3">
              Loading your orders...
            </p>
          </div>
        )}

        {/* NO ORDERS */}
        {!loading && orders.length === 0 && (
          <div className="bg-white rounded-2xl border border-rose-100 shadow-sm py-20 text-center">
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag
                size={28}
                className="text-rose-400"
              />
            </div>

            <h2 className="text-xl font-bold text-gray-800 mt-5">
              No Orders Yet
            </h2>

            <p className="text-gray-500 text-sm mt-2">
              You haven't placed any orders yet.
            </p>
          </div>
        )}

        {/* ORDERS */}
        {!loading && orders.length > 0 && (
          <div className="space-y-5">

            {orders.map((order) => {
              const statusStyle =
                getStatusStyle(order.status);

              return (
                <div
                  key={
                    order._id ||
                    order.orderId
                  }
                  className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden"
                >

                  {/* ORDER HEADER */}
                  <div className="p-5 border-b border-rose-100 bg-rose-50/50">

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">
                          Order ID
                        </p>

                        <h2 className="text-lg font-bold text-rose-600 font-mono mt-1">
                          {order.orderId}
                        </h2>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">

                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${statusStyle.className}`}
                        >
                          {statusStyle.icon}
                          {order.status ||
                            "Pending"}
                        </span>

                        <button
                          onClick={() =>
                            setSelectedOrder(
                              order
                            )
                          }
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-sm font-semibold transition"
                        >
                          <Eye size={15} />
                          View
                        </button>

                      </div>
                    </div>
                  </div>

                  {/* ORDER INFO */}
                  <div className="p-5">

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                          <Calendar
                            size={18}
                            className="text-rose-500"
                          />
                        </div>

                        <div>
                          <p className="text-xs text-gray-500">
                            Date
                          </p>

                          <p className="text-sm font-semibold text-gray-800">
                            {formatDate(
                              order.date ||
                                order.createdAt
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                          <Package
                            size={18}
                            className="text-blue-500"
                          />
                        </div>

                        <div>
                          <p className="text-xs text-gray-500">
                            Items
                          </p>

                          <p className="text-sm font-semibold text-gray-800">
                            {getProductCount(
                              order
                            )}{" "}
                            item(s)
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
                          <ShoppingBag
                            size={18}
                            className="text-green-500"
                          />
                        </div>

                        <div>
                          <p className="text-xs text-gray-500">
                            Total
                          </p>

                          <p className="text-sm font-bold text-gray-800">
                            {formatMoney(
                              order.total
                            )}
                          </p>
                        </div>
                      </div>

                    </div>

                    {/* PRODUCTS */}
                    {Array.isArray(
                      order.products
                    ) &&
                      order.products.length > 0 && (
                        <div className="space-y-3">

                          {order.products
                            .slice(0, 3)
                            .map(
                              (
                                product,
                                index
                              ) => {
                                const info =
                                  product.productInfo ||
                                  product;

                                return (
                                  <div
                                    key={
                                      index
                                    }
                                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50"
                                  >

                                    <div className="w-14 h-14 rounded-xl bg-white overflow-hidden flex-shrink-0">
                                      {info.image ? (
                                        <img
                                          src={
                                            info.image
                                          }
                                          alt={
                                            info.name ||
                                            "Product"
                                          }
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                          <Package
                                            size={
                                              20
                                            }
                                            className="text-gray-300"
                                          />
                                        </div>
                                      )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                      <p className="font-semibold text-gray-800 truncate">
                                        {info.name ||
                                          "Product"}
                                      </p>

                                      <p className="text-xs text-gray-500 mt-1">
                                        Qty:{" "}
                                        {product.quantity ||
                                          1}
                                      </p>
                                    </div>

                                    <p className="font-semibold text-gray-800">
                                      {formatMoney(
                                        (Number(
                                          info.price
                                        ) ||
                                          0) *
                                          (Number(
                                            product.quantity
                                          ) ||
                                            1)
                                      )}
                                    </p>
                                  </div>
                                );
                              }
                            )}

                          {order.products.length >
                            3 && (
                            <p className="text-center text-xs text-gray-500 pt-1">
                              +
                              {order.products.length -
                                3}{" "}
                              more product(s)
                            </p>
                          )}

                        </div>
                      )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================================================= */}
      {/* ORDER DETAILS MODAL */}
      {/* ================================================= */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() =>
            setSelectedOrder(null)
          }
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="sticky top-0 bg-white border-b border-rose-100 p-5 flex items-center justify-between rounded-t-3xl">
              <div>
                <p className="text-xs text-rose-500 font-semibold uppercase">
                  Order Details
                </p>

                <h2 className="text-xl font-bold text-gray-800 mt-1">
                  {selectedOrder.orderId}
                </h2>
              </div>

              <button
                onClick={() =>
                  setSelectedOrder(null)
                }
                className="w-9 h-9 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center"
              >
                <XCircle size={19} />
              </button>
            </div>

            <div className="p-5 space-y-5">

              {/* STATUS */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-50 border border-rose-100">

                <div>
                  <p className="text-xs text-gray-500">
                    Order Status
                  </p>

                  <div className="mt-2">
                    {(() => {
                      const style =
                        getStatusStyle(
                          selectedOrder.status
                        );

                      return (
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${style.className}`}
                        >
                          {style.icon}
                          {selectedOrder.status ||
                            "Pending"}
                        </span>
                      );
                    })()}
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    Total
                  </p>

                  <p className="text-xl font-bold text-rose-600 mt-1">
                    {formatMoney(
                      selectedOrder.total
                    )}
                  </p>
                </div>
              </div>

              {/* PRODUCTS */}
              <div>
                <h3 className="font-bold text-gray-800 mb-3">
                  Ordered Products
                </h3>

                <div className="space-y-3">
                  {Array.isArray(
                    selectedOrder.products
                  ) &&
                    selectedOrder.products.map(
                      (
                        product,
                        index
                      ) => {
                        const info =
                          product.productInfo ||
                          product;

                        return (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 rounded-xl border border-rose-100"
                          >

                            <div className="w-16 h-16 rounded-xl bg-rose-50 overflow-hidden">
                              {info.image ? (
                                <img
                                  src={
                                    info.image
                                  }
                                  alt={
                                    info.name ||
                                    "Product"
                                  }
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package
                                    size={
                                      22
                                    }
                                    className="text-rose-300"
                                  />
                                </div>
                              )}
                            </div>

                            <div className="flex-1">
                              <p className="font-semibold text-gray-800">
                                {info.name ||
                                  "Product"}
                              </p>

                              <p className="text-sm text-gray-500 mt-1">
                                Quantity:{" "}
                                {product.quantity ||
                                  1}
                              </p>
                            </div>

                            <p className="font-bold text-gray-800">
                              {formatMoney(
                                (Number(
                                  info.price
                                ) || 0) *
                                  (Number(
                                    product.quantity
                                  ) || 1)
                              )}
                            </p>

                          </div>
                        );
                      }
                    )}
                </div>
              </div>

              {/* ADDRESS */}
              <div className="p-4 rounded-2xl bg-gray-50">
                <h3 className="font-bold text-gray-800 mb-2">
                  Delivery Address
                </h3>

                <p className="text-sm text-gray-600">
                  {selectedOrder.address ||
                    "N/A"}
                </p>

                <p className="text-sm text-gray-600 mt-1">
                  {selectedOrder.city ||
                    ""}
                  {selectedOrder.city &&
                  selectedOrder.postalCode
                    ? ", "
                    : ""}
                  {selectedOrder.postalCode ||
                    ""}
                </p>

                <p className="text-sm text-gray-600 mt-1">
                  {selectedOrder.phone ||
                    ""}
                </p>
              </div>

              {/* PAYMENT */}
              <div className="p-4 rounded-2xl bg-gray-50">
                <h3 className="font-bold text-gray-800 mb-2">
                  Payment
                </h3>

                <p className="text-sm text-gray-600">
                  Method:{" "}
                  <span className="font-semibold text-gray-800">
                    {selectedOrder.paymentMethod ||
                      "N/A"}
                  </span>
                </p>

                <p className="text-sm text-gray-600 mt-1">
                  Status:{" "}
                  <span className="font-semibold text-gray-800">
                    {selectedOrder.paymentStatus ||
                      "N/A"}
                  </span>
                </p>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}