import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  Search,
  Heart,
  ShoppingBag,
  User,
} from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Login", path: "/login" },
    { name: "Signup", path: "/signup" },
    { name: "Categories", path: "/categories" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 px-4 py-4">
      <nav className="max-w-7xl mx-auto flex items-center justify-between rounded-full border border-white/30 bg-white/70 backdrop-blur-xl shadow-lg px-6 py-3">

        {/* Logo */}
        <Link
          to="/"
          className="text-3xl font-bold text-[#8B1A24]"
        >
          LadyItem
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center gap-8 font-medium text-[#121212]">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                className="transition hover:text-[#8B1A24]"
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

          <button className="relative hover:text-[#8B1A24] transition">
            <ShoppingBag size={20} />
            <span className="absolute -top-2 -right-2 bg-[#FF8A75] text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
              2
            </span>
          </button>

          <Link
            to="/login"
            className="flex items-center gap-2 bg-[#8B1A24] text-white px-5 py-2 rounded-full hover:bg-[#FF8A75] transition duration-300"
          >
            <User size={18} />
            Login
          </Link>

        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden mt-4 bg-white rounded-3xl shadow-xl p-6 max-w-sm mx-auto">

          <ul className="flex flex-col gap-5">

            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className="block text-lg font-medium hover:text-[#8B1A24]"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}

            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="mt-4 bg-[#8B1A24] text-white text-center py-3 rounded-full hover:bg-[#FF8A75] transition"
            >
              Login
            </Link>

          </ul>

        </div>
      )}
    </header>
  );
};

export default Header;

