import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminProductPage from "./admin/AdminProductPage";
import { Link } from "react-router-dom";

export default function AdminPage() {
  return (
    <div>
        
      
    <div className="flex h-screen bg-gray-50 font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg rounded-r-2xl p-6 flex flex-col gap-6">
        <h2 className="text-2xl font-semibold mb-4 mt-[100px]">Admin Panel</h2>
        <Link
          to="/admin/products"
          className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Products
        </Link>
        <Link
          to="/admin/user"
          className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Users
        </Link>
        <Link
          to="/admin/order"
          className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Orders
        </Link>
        <Link
          to="/admin/reviews"
          className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Reviews
        </Link>
        
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-auto">
        
        <div className="bg-white rounded-3xl shadow-xl p-8 mt-[50px] ">
          <h1 className="text-2xl font-bold mb-4">Welcome to the Admin Panel</h1>
          
          {<Routes>
            <Route path="/products" element={<AdminProductPage />} />
            <Route path="/user" element={<h1>user</h1>} />
            <Route path="/order" element={<h1 className="text-xl">Orders</h1>} />
            <Route path="/reviews" element={<h1 className="text-xl">Reviews</h1>} />
            <Route path="/addProduct" element={<h1>addprodut</h1>} />
            <Route
              path="/edit-product"
              element={<h1>editproduct</h1>}
            />
            <Route path="/addUser" element={<h1>add user</h1>} />
          </Routes>}
        </div>
      </main>
    </div>
    </div>
  );
}
