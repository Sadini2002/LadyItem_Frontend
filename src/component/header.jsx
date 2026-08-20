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
  ShieldAlert,
} from "lucide-react";
import { useCart } from "../context/CartContext";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();


  // Listen for storage / location changes to update login status
  useEffect(() => {
    const savedToken = localStorage.getItem("token") || "";
    let savedRole = localStorage.getItem("role") || "";

    if (savedToken && !savedRole) {
      try {
        const payload = JSON.parse(atob(savedToken.split(".")[1]));
        savedRole = payload.role;
      } catch (e) {}
    }

    setToken(savedToken);
    setRole(savedRole);
  }, [location]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken("");
    setRole("");
    toast.success("Logged out successfully");
    navigate("/login");
  }

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Cart", path: "/cart" },
    ...(token && role === "admin"
      ? [{ name: "Admin Panel", path: "/admin" }]
      : []),
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-4 py-4">
      <nav className="max-w-7xl mx-auto flex items-center justify-between rounded-full border border-white/30 bg-white/70 backdrop-blur-xl shadow-lg px-6 py-3">
        {/* Logo */}
        <Link to="/" className="text-3xl font-bold text-[#8B1A24]">
          LadyItem
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center gap-8 font-medium text-[#121212]">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                className={`transition hover:text-[#8B1A24] ${
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
          <button className="hover:text-[#8B1A24] transition">
            <Search size={20} />
          </button>

          <button className="hover:text-[#8B1A24] transition">
            <Heart size={20} />
          </button>

          <Link to="/cart" className="relative hover:text-[#8B1A24] transition">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#FF8A75] text-white rounded-full text-xs font-bold w-5 h-5 flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            )}
          </Link>

          {token ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-[#8B1A24] text-white px-5 py-2 rounded-full hover:bg-[#A61F2C] transition duration-300 shadow-md"
            >
              <LogOut size={18} />
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 bg-[#8B1A24] text-white px-5 py-2 rounded-full hover:bg-[#FF8A75] transition duration-300"
            >
              <User size={18} />
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="lg:hidden text-[#8B1A24]" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden mt-4 bg-white/95 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl p-6 max-w-sm mx-auto">
          <ul className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={`block text-lg font-medium hover:text-[#8B1A24] ${
                    link.name === "Admin Panel" ? "text-[#8B1A24] font-bold" : ""
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}

            {token ? (
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="mt-4 bg-[#8B1A24] text-white text-center py-3 rounded-full hover:bg-[#A61F2C] transition flex items-center justify-center gap-2 font-medium"
              >
                <LogOut size={18} />
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="mt-4 bg-[#8B1A24] text-white text-center py-3 rounded-full hover:bg-[#FF8A75] transition block"
              >
                Login
              </Link>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
