import { Routes, Route } from "react-router-dom";
import Header from "../component/header";
import ProductPage from "../client/ProductPage";
import HomePage from "./HomePage";
import ProductOverview from "../client/productOverview";
import CartPage from "../client/cart";

export default function Home() {
  return (
    <div className="w-full h-screen flex flex-col items-center">
      
         
      <div className="w-full h-[calc(100vh-80px)] flex flex-col items-center">
         <Header></Header> 
        <Routes path="/*">
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/about" element={<h1>About</h1>} />
          <Route path="/contact" element={<h1>Contact</h1>} />
          <Route path="/profile" element={<h1>Wishlist</h1>} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/overview/:id" element={<ProductOverview />} />
          <Route path="/*" element={<h1>404 NOT FOUND</h1>} />
        </Routes>
      </div>
    </div>
  );
}
