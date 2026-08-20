import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./component/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminPage from "./pages/AdminPage";
import { Toaster } from "react-hot-toast";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ProductPage from "./pages/ProductPage";
import Testing from "./pages/Testing";

function App() {
  return (
    <BrowserRouter>
    <div>
      <Toaster position="top-right" />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/categories" element={<Navigate to="/products" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage/>} />
        <Route path="/testing" element={<Testing />} />
        
        

        <Route path="/*" element={<h1 className="text-2xl font-bold ">404 not found</h1>} />
      </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;