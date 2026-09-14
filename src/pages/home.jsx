
import { Link as RouterLink } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-[#FFF8F7] via-[#FFF0EE] to-[#FFE4DF] flex flex-col justify-between items-center px-6 overflow-hidden select-none font-sans">
      
      {/* Background Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-5%] h-[450px] w-[450px] rounded-full bg-[#FF8A75]/25 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] h-[500px] w-[500px] rounded-full bg-[#8B1A24]/15 blur-[130px] pointer-events-none" />
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-white/40 blur-[90px] pointer-events-none" />

      {/* Top Bar / Brand Header */}
      <header className="relative z-20 w-full max-w-6xl pt-8 pb-4 flex justify-between items-center">
        <RouterLink to="/" className="flex items-center gap-3 group">
          {/* Brand Logo Icon */}
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#8B1A24] to-[#FF8A75] flex items-center justify-center shadow-lg shadow-[#8B1A24]/20 group-hover:scale-105 transition-transform duration-300">
            <svg 
              className="w-6 h-6 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
              />
            </svg>
          </div>
          {/* Brand Name */}
          <span className="text-2xl font-bold tracking-tight text-[#3A0A0E]">
            Lady<span className="text-[#8B1A24]">Item</span>
          </span>
        </RouterLink>

        {/* Guest Browse Action */}
        <RouterLink 
          to="/products" 
          className="text-sm font-medium text-gray-600 hover:text-[#8B1A24] transition-colors duration-200 flex items-center gap-1.5"
        >
          Explore Catalog
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </RouterLink>
      </header>

      {/* Main Glass Hero Card */}
      <main className="relative z-10 max-w-2xl w-full my-auto rounded-3xl border border-white/60 bg-white/40 backdrop-blur-2xl shadow-[0_20px_50px_rgba(139,26,36,0.08)] p-8 sm:p-12 text-center transition-all duration-300">
        
        {/* Badge Indicator */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8B1A24]/10 border border-[#8B1A24]/15 mb-6">
          <span className="w-2 h-2 rounded-full bg-[#8B1A24] animate-pulse"></span>
          <span className="text-xs font-semibold tracking-wide text-[#8B1A24] uppercase">New Collection 2026</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#3A0A0E] mb-6 leading-[1.15]">
          Elegance Defined For <span className="bg-gradient-to-r from-[#8B1A24] via-[#B82D3A] to-[#FF8A75] bg-clip-text text-transparent">Every Woman</span>
        </h1>

        {/* Description */}
        <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-lg mx-auto mb-10">
          Discover handpicked fashion designed for the modern woman. Premium quality, trendsetting styles, and an effortless shopping experience crafted for you.
        </p>

        {/* CTA Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-md mx-auto">
          <RouterLink
            to="/login"
            className="w-full sm:w-1/2 py-3.5 px-8 rounded-2xl bg-gradient-to-r from-[#8B1A24] to-[#6E121C] text-white font-semibold shadow-lg shadow-[#8B1A24]/25 hover:shadow-xl hover:shadow-[#8B1A24]/35 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-center"
          >
            Log In
          </RouterLink>

          <RouterLink
            to="/signup"
            className="w-full sm:w-1/2 py-3.5 px-8 rounded-2xl bg-white/80 border border-[#8B1A24]/30 text-[#8B1A24] font-semibold hover:bg-white hover:border-[#8B1A24] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-center backdrop-blur-md"
          >
            Create Account
          </RouterLink>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="relative z-10 py-6 text-center text-xs text-gray-500 font-medium">
        © {new Date().getFullYear()} LadyItem Inc. All rights reserved.
      </footer>
    </div>
  );
}