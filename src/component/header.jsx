import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Menu,
  X,
  Search,
  Heart,
  ShoppingBag,
  User,
  LogOut,
} from "lucide-react";
import { useCart } from "../context/CartContext";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();

  useEffect(() => {
    const savedToken = localStorage.getItem("token") || "";
    let savedRole = localStorage.getItem("role") || "";

    if (savedToken && !savedRole) {
      try {
        const payload = JSON.parse(atob(savedToken.split(".")[1]));
        savedRole = payload.role;
      } catch (error) {
        console.error("Failed to read token:", error);
      }
    }

    setToken(savedToken);
    setRole(savedRole);
    setIsOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    setToken("");
    setRole("");

    toast.success("Logged out successfully");
    navigate("/login");
  };

  // Hide header only on authentication pages
  const hiddenPages = [
    "/login",
    "/register",
    "/forgot-password",
  ];

  if (hiddenPages.includes(location.pathname)) {
    return null;
  }

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Cart", path: "/cart" },

    ...(token && role === "admin"
      ? [{ name: "Admin Panel", path: "/admin/products" }]
      : []),

    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-4 py-4">
      <nav className="max-w-7xl mx-auto flex items-center justify-between rounded-full border border-white/30 bg-white/80 backdrop-blur-xl shadow-lg px-6 py-3">

        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-bold text-[#8B1A24]"
        >
          LadyItem
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex items-center gap-8 font-medium text-[#121212]">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                className={`transition duration-200 hover:text-[#8B1A24] ${
                  link.name === "Admin Panel"
                    ? "font-semibold text-[#8B1A24] bg-[#8B1A24]/10 px-3 py-1.5 rounded-full border border-[#8B1A24]/20"
                    : ""
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Icons */}
        <div className="hidden lg:flex items-center gap-5">

          {/* Search */}
          <button
            className="hover:text-[#8B1A24] transition"
            title="Search"
          >
            <Search size={20} />
          </button>

          {/* Wishlist */}
          <button
            className="hover:text-[#8B1A24] transition"
            title="Wishlist"
          >
            <Heart size={20} />
          </button>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative hover:text-[#8B1A24] transition"
            title="Cart"
          >
            <ShoppingBag size={20} />

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#FF8A75] text-white rounded-full text-xs font-bold w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Profile */}
          {token && (
            <Link
              to="/profile"
              className="hover:text-[#8B1A24] transition"
              title="Profile"
            >
              <User size={20} />
            </Link>
          )}

          {/* Login / Logout */}
          {token ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-[#8B1A24] text-white px-5 py-2 rounded-full hover:bg-[#A61F2C] transition shadow-md"
            >
              <LogOut size={18} />
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 bg-[#8B1A24] text-white px-5 py-2 rounded-full hover:bg-[#FF8A75] transition"
            >
              <User size={18} />
              Login
            </Link>
          )}
        </div>

        {/* Mobile Button */}
        <button
          className="lg:hidden text-[#8B1A24]"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden mt-4 bg-white/95 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl p-6 max-w-sm mx-auto">

          <ul className="flex flex-col gap-4">

            {/* Navigation Links */}
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block text-lg font-medium hover:text-[#8B1A24] ${
                    link.name === "Admin Panel"
                      ? "text-[#8B1A24] font-bold"
                      : ""
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}

            {/* Profile */}
            {token && (
              <li>
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 text-lg font-medium hover:text-[#8B1A24]"
                >
                  <User size={20} />
                  Profile
                </Link>
              </li>
            )}

            {/* Logout / Login */}
            {token ? (
              <li>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="w-full mt-4 bg-[#8B1A24] text-white py-3 rounded-full hover:bg-[#A61F2C] transition flex items-center justify-center gap-2 font-medium"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </li>
            ) : (
              <li>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block mt-4 bg-[#8B1A24] text-white text-center py-3 rounded-full hover:bg-[#FF8A75] transition"
                >
                  Login
                </Link>
              </li>
            )}

          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;