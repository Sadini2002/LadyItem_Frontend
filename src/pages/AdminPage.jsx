import React, { useEffect } from "react";
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import toast from "react-hot-toast";

import {
  Package,
  Users,
  ShoppingCart,
  Star,
  LogOut,
} from "lucide-react";

import AdminProductPage from "./admin/AdminProductPage";
import AddProductPage from "./admin/AddproductPage";
import UserPage from "./admin/UserPage";
import AddUserPage from "./admin/AddUserPage";
import EditUserPage from "./admin/EditUserPage";
import EditProductPage from "./admin/EditProductPage";
import AdminOrdersPage from "./admin/AdminOrdersPage";
import AdminReviewsPage from "./admin/AdminReviewsPage";

export default function AdminPage() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    let userRole = localStorage.getItem("role");

    if (token && !userRole) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        userRole = payload.role;
      } catch (error) {
        console.error("Failed to parse token:", error);
      }
    }

    if (!token || userRole !== "admin") {
      toast.error("Access Denied: Admin privileges required");
      navigate("/products");
    }
  }, [navigate]);

  const token = localStorage.getItem("token");
  let userRole = localStorage.getItem("role");

  if (token && !userRole) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      userRole = payload.role;
    } catch (error) {
      console.error("Failed to parse token:", error);
    }
  }

  if (!token || userRole !== "admin") {
    return null;
  }

  const menuItems = [
    {
      name: "Products",
      path: "/admin/products",
      icon: Package,
    },
    {
      name: "Users",
      path: "/admin/user",
      icon: Users,
    },
    {
      name: "Orders",
      path: "/admin/order",
      icon: ShoppingCart,
    },
    {
      name: "Reviews",
      path: "/admin/reviews",
      icon: Star,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    toast.success("Logged out successfully");
    navigate("/login");
  };

  const isActive = (path) => {
    if (path === "/admin/products") {
      return (
        location.pathname === "/admin/products" ||
        location.pathname.includes("/addProduct") ||
        location.pathname.includes("/edit-product")
      );
    }

    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#f7f7f8] font-sans pt-24">

      <div className="flex min-h-[calc(100vh-96px)]">

        {/* Sidebar */}
        <aside className="w-60 bg-white border-r border-gray-200 shadow-sm flex flex-col">

          {/* Logo */}
          <div className="px-6 py-6 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-[#8B1A24]">
              LadyItem
            </h1>

            <p className="text-xs text-gray-400 mt-1">
              Admin Panel
            </p>
          </div>

          {/* Navigation */}
          <div className="flex-1 px-4 py-6">

            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-4">
              Management
            </p>

            <div className="space-y-2">

              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      active
                        ? "bg-[#8B1A24] text-white shadow-md"
                        : "text-gray-600 hover:bg-[#8B1A24]/10 hover:text-[#8B1A24]"
                    }`}
                  >
                    <Icon size={19} />

                    <span className="font-medium text-sm">
                      {item.name}
                    </span>
                  </Link>
                );
              })}

            </div>
          </div>

          {/* Admin Profile */}
          <div className="px-4 pb-5">

            <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-3 border border-gray-100">

              <div className="w-10 h-10 rounded-full bg-[#8B1A24] text-white flex items-center justify-center font-bold">
                A
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Admin
                </p>

                <p className="text-xs text-gray-400">
                  Administrator
                </p>
              </div>

            </div>

            <button
              onClick={handleLogout}
              className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-gray-600 hover:text-[#8B1A24] hover:bg-[#8B1A24]/10 transition"
            >
              <LogOut size={18} />

              <span className="text-sm font-medium">
                Logout
              </span>
            </button>

          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">

          {/* Page Header */}
          <div className="mb-6">

            <h2 className="text-2xl font-bold text-gray-800">
              Welcome, Admin 👋
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Manage your LadyItem store from here.
            </p>

          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[calc(100vh-190px)]">

            <Routes>

              <Route
                path="/products"
                element={<AdminProductPage />}
              />

              <Route
                path="/user"
                element={<UserPage />}
              />

              <Route
                path="/order"
                element={<AdminOrdersPage />}
              />

              <Route
                path="/orders"
                element={<AdminOrdersPage />}
              />

              <Route
                path="/reviews"
                element={<AdminReviewsPage />}
              />

              <Route
                path="/addProduct"
                element={<AddProductPage />}
              />

              <Route
                path="/edit-user/:id"
                element={<EditUserPage />}
              />

              <Route
                path="/addUser"
                element={<AddUserPage />}
              />

              <Route
                path="/edit-product"
                element={<EditProductPage />}
              />

              <Route
                path="/edit-product/:productId"
                element={<EditProductPage />}
              />

            </Routes>

          </div>

        </main>

      </div>
    </div>
  );
}