
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#FFF5F4] via-white to-[#FFE5E0] flex items-center justify-center px-6">

      {/* Background Decorative Circles */}
      <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-[#FF8A75]/20 blur-3xl"></div>
      <div className="absolute bottom-20 right-10 h-80 w-80 rounded-full bg-[#8B1A24]/20 blur-3xl"></div>

      {/* Glass Card */}
      <div className="relative z-10 max-w-xl w-full rounded-3xl border border-white/30 bg-white/60 backdrop-blur-xl shadow-2xl p-10 text-center">

        <h1 className="text-5xl font-bold text-[#8B1A24] mb-5">
          Welcome to LadyItem
        </h1>

        <p className="text-gray-700 text-lg leading-8 mb-8">
          Discover elegant fashion designed for modern women.
          Shop the latest collections with premium quality,
          affordable prices, and a seamless shopping experience.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-5">

          <Link
            to="/login"
            className="px-8 py-3 rounded-full bg-[#8B1A24] text-white font-semibold hover:bg-[#6E121C] transition duration-300 shadow-lg"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="px-8 py-3 rounded-full border-2 border-[#8B1A24] text-[#8B1A24] font-semibold hover:bg-[#FF8A75] hover:text-white hover:border-[#FF8A75] transition duration-300"
          >
            Create Account
          </Link>

        </div>

      </div>
    </div>
  );
}