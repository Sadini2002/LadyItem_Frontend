import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  CreditCard,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Admin not logged in");
        setLoading(false);
        return;
      }

      const baseUrl = (import.meta.env.VITE_BACKEND_URL || "http://localhost:3000").replace(/\/+$/, "");
      const res = await axios.get(`${baseUrl}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(res.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error(error?.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateStatus = async (orderId, newStatus, newPaymentStatus) => {
    try {
      setUpdatingId(orderId);
      const token = localStorage.getItem("token");
      const baseUrl = (import.meta.env.VITE_BACKEND_URL || "http://localhost:3000").replace(/\/+$/, "");

      const body = {};
      if (newStatus) body.status = newStatus;
      if (newPaymentStatus) body.paymentStatus = newPaymentStatus;

      const res = await axios.put(`${baseUrl}/orders/${orderId}`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      toast.success("Order status updated!");

      // Update local state
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, ...res.data.order } : o))
      );

      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, ...res.data.order }));
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error(error?.response?.data?.message || "Failed to update order");
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (order.orderId && order.orderId.toLowerCase().includes(q)) ||
      (order.name && order.name.toLowerCase().includes(q)) ||
      (order.email && order.email.toLowerCase().includes(q)) ||
      (order.phone && order.phone.toLowerCase().includes(q));

    const matchesStatus =
      statusFilter === "all" ||
      (order.status && order.status.toLowerCase() === statusFilter.toLowerCase());

    const matchesPayment =
      paymentFilter === "all" ||
      (order.paymentStatus &&
        order.paymentStatus.toLowerCase() === paymentFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const getStatusBadge = (status) => {
    const s = (status || "Pending").toLowerCase();
    if (s === "delivered") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
          <CheckCircle2 size={12} /> Delivered
        </span>
      );
    }
    if (s === "shipped") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
          <Truck size={12} /> Shipped
        </span>
      );
    }
    if (s === "processing") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
          <Clock size={12} /> Processing
        </span>
      );
    }
    if (s === "cancelled") {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
          <XCircle size={12} /> Cancelled
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
        <Clock size={12} /> Pending
      </span>
    );
  };

  const getPaymentBadge = (status) => {
    const p = (status || "Unpaid").toLowerCase();
    if (p === "paid") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
          ✓ Paid
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-300">
        ⌛ Unpaid
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            View, track, and update all customer orders
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition shadow-sm"
        >
          Refresh Orders
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
        {/* Search */}
        <div className="sm:col-span-6 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, name, email, or phone..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 transition text-sm bg-white"
          />
        </div>

        {/* Order Status Filter */}
        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 transition text-sm bg-white text-gray-700"
          >
            <option value="all">All Order Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Payment Filter */}
        <div className="sm:col-span-3">
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900 transition text-sm bg-white text-gray-700"
          >
            <option value="all">All Payment Statuses</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="py-20 text-center text-gray-500">
          <div className="w-10 h-10 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          Loading orders...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-16 text-center bg-gray-50 rounded-2xl border border-gray-200">
          <ShoppingBag className="mx-auto text-gray-400 mb-3" size={40} />
          <p className="text-gray-700 font-semibold">No Orders Found</p>
          <p className="text-xs text-gray-500 mt-1">
            {searchQuery || statusFilter !== "all" || paymentFilter !== "all"
              ? "Try adjusting your filters or search terms."
              : "No customer orders have been placed yet."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm bg-white">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-100 text-xs uppercase font-semibold text-gray-700">
              <tr>
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => {
                const dateStr = order.date
                  ? new Date(order.date).toLocaleDateString()
                  : "N/A";
                return (
                  <tr key={order._id} className="hover:bg-gray-50/80 transition">
                    {/* Order ID */}
                    <td className="py-4 px-4 font-mono font-bold text-gray-900">
                      {order.orderId}
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-4">
                      <div className="font-semibold text-gray-900">{order.name}</div>
                      <div className="text-xs text-gray-500">{order.email}</div>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 text-xs text-gray-500">{dateStr}</td>

                    {/* Total */}
                    <td className="py-4 px-4 font-bold text-gray-900">
                      Rs. {(order.total || 0).toLocaleString()}
                    </td>

                    {/* Payment Status & Method */}
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        {getPaymentBadge(order.paymentStatus)}
                        <span className="text-[11px] text-gray-500 uppercase font-medium">
                          {order.paymentMethod || "COD"}
                        </span>
                      </div>
                    </td>

                    {/* Order Status Select */}
                    <td className="py-4 px-4">
                      <select
                        value={order.status || "Pending"}
                        disabled={updatingId === order._id}
                        onChange={(e) =>
                          handleUpdateStatus(order._id, e.target.value, null)
                        }
                        className="text-xs font-semibold rounded-lg border border-gray-300 px-2.5 py-1.5 bg-white text-gray-800 focus:ring-2 focus:ring-gray-900 transition"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium rounded-lg transition"
                      >
                        <Eye size={14} /> View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl relative border border-gray-200 text-gray-800 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  ORDER DETAILS
                </span>
                <h2 className="text-2xl font-black text-gray-900">
                  {selectedOrder.orderId}
                </h2>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 flex items-center justify-center transition font-bold"
              >
                ✕
              </button>
            </div>

            {/* Quick Status Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs">
              <div>
                <span className="text-gray-400 block mb-1">Status</span>
                {getStatusBadge(selectedOrder.status)}
              </div>
              <div>
                <span className="text-gray-400 block mb-1">Payment</span>
                {getPaymentBadge(selectedOrder.paymentStatus)}
              </div>
              <div>
                <span className="text-gray-400 block mb-1">Method</span>
                <span className="font-bold text-gray-800 uppercase">
                  {selectedOrder.paymentMethod || "COD"}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block mb-1">Date</span>
                <span className="font-semibold text-gray-700">
                  {selectedOrder.date
                    ? new Date(selectedOrder.date).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>

            {/* Quick Status Update Buttons */}
            <div className="p-4 bg-gray-100 rounded-2xl space-y-3">
              <span className="text-xs font-bold text-gray-700 block uppercase tracking-wider">
                Quick Actions
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleUpdateStatus(selectedOrder._id, "Processing", null)}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition"
                >
                  Mark Processing
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedOrder._id, "Shipped", null)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition"
                >
                  Mark Shipped
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedOrder._id, "Delivered", null)}
                  className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition"
                >
                  Mark Delivered
                </button>
                <button
                  onClick={() =>
                    handleUpdateStatus(
                      selectedOrder._id,
                      null,
                      selectedOrder.paymentStatus === "Paid" ? "Unpaid" : "Paid"
                    )
                  }
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition"
                >
                  Toggle Paid / Unpaid
                </button>
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-b border-gray-200 py-4 text-xs">
              <div className="space-y-2">
                <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[11px]">
                  Customer Information
                </h4>
                <div className="flex items-center gap-2 text-gray-700">
                  <User size={14} className="text-gray-400" />
                  <span className="font-medium">{selectedOrder.name}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail size={14} className="text-gray-400" />
                  <span>{selectedOrder.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone size={14} className="text-gray-400" />
                  <span>{selectedOrder.phone || "No phone provided"}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-gray-900 uppercase tracking-wider text-[11px]">
                  Shipping Address
                </h4>
                <div className="flex items-start gap-2 text-gray-700">
                  <MapPin size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                  <span>
                    {selectedOrder.address || "No street address"}
                    {selectedOrder.city ? `, ${selectedOrder.city}` : ""}
                    {selectedOrder.postalCode ? ` ${selectedOrder.postalCode}` : ""}
                  </span>
                </div>
              </div>
            </div>

            {/* Items List */}
            <div>
              <h4 className="font-bold text-gray-900 uppercase tracking-wider text-xs mb-3">
                Order Items ({selectedOrder.products?.length || 0})
              </h4>
              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {selectedOrder.products?.map((item, idx) => {
                  const info = item.productInfo || {};
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        {info.image && (
                          <img
                            src={
                              Array.isArray(info.image)
                                ? info.image[0]
                                : info.image
                            }
                            alt={info.name}
                            className="w-10 h-10 rounded-lg object-cover bg-gray-200 border border-gray-200"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        )}
                        <div>
                          <p className="font-bold text-gray-900">{info.name || "Product"}</p>
                          <p className="text-gray-500">
                            Unit Price: Rs. {(info.price || 0).toLocaleString()} × {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900">
                        Rs. {((info.price || 0) * (item.quantity || 1)).toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Total Summary */}
              <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-baseline text-sm">
                <span className="font-bold text-gray-900">Grand Total</span>
                <span className="text-xl font-black text-gray-900">
                  Rs. {(selectedOrder.total || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
