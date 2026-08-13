import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#FFF5F4] via-white to-[#FFE5E0]">

      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden px-6 py-20">

        {/* Background Decorative Circles */}
        <div className="absolute top-10 left-[-100px] h-80 w-80 rounded-full bg-[#FF8A75]/20 blur-3xl"></div>

        <div className="absolute top-20 right-[-100px] h-80 w-80 rounded-full bg-[#8B1A24]/20 blur-3xl"></div>

        <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          {/* Hero Text */}
          <div>
            <p className="text-[#FF8A75] font-semibold uppercase tracking-[3px] mb-4">
              About LadyItem
            </p>

            <h1 className="text-5xl md:text-6xl font-bold text-[#8B1A24] leading-tight">
              Style That
              <span className="text-[#FF8A75]"> Speaks </span>
              For You
            </h1>

            <p className="text-gray-700 text-lg leading-8 mt-6">
              Welcome to LadyItem, your destination for elegant fashion,
              beautiful accessories, and stylish products designed for
              modern women.
            </p>

            <p className="text-gray-600 leading-7 mt-4">
              We believe every woman deserves to feel confident, beautiful,
              and comfortable in her own style.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">

              <Link
                to="/products"
                className="px-8 py-3 rounded-full bg-[#8B1A24] text-white font-semibold hover:bg-[#6E121C] transition duration-300 shadow-lg"
              >
                Shop Now
              </Link>

              <Link
                to="/contact"
                className="px-8 py-3 rounded-full border-2 border-[#8B1A24] text-[#8B1A24] font-semibold hover:bg-[#FF8A75] hover:text-white hover:border-[#FF8A75] transition duration-300"
              >
                Contact Us
              </Link>

            </div>
          </div>


          {/* Hero Image */}
          <div className="relative">

            <div className="absolute -top-6 -right-6 h-40 w-40 rounded-full bg-[#FF8A75]/30 blur-3xl"></div>

            <img
              src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80"
              alt="Lady fashion"
              className="relative z-10 w-full h-[500px] object-cover rounded-3xl shadow-2xl"
            />

            <div className="absolute z-20 bottom-6 left-6 bg-white/80 backdrop-blur-lg rounded-2xl px-6 py-4 shadow-xl">

              <p className="text-sm text-gray-500">
                Fashion & Style
              </p>

              <p className="text-xl font-bold text-[#8B1A24]">
                Made For You ♡
              </p>

            </div>

          </div>

        </div>
      </section>


      {/* ================= ABOUT LADYITEM ================= */}
      <section className="px-6 py-20">

        <div className="max-w-6xl mx-auto">

          <div className="rounded-3xl border border-white/40 bg-white/60 backdrop-blur-xl shadow-xl p-10 md:p-14">

            <div className="text-center max-w-3xl mx-auto">

              <p className="text-[#FF8A75] font-semibold uppercase tracking-[3px] mb-3">
                Who We Are
              </p>

              <h2 className="text-4xl md:text-5xl font-bold text-[#8B1A24] mb-6">
                About LadyItem
              </h2>

              <p className="text-gray-700 text-lg leading-8">
                LadyItem is an online shopping destination created for women
                who love fashion, beauty, elegance, and individuality.
              </p>

              <p className="text-gray-600 leading-8 mt-5">
                Our goal is to bring together stylish and quality products
                that fit different personalities, lifestyles, and occasions.
                We carefully select our products to provide our customers
                with a shopping experience that is simple, enjoyable, and
                trustworthy.
              </p>

            </div>

          </div>

        </div>
      </section>


      {/* ================= WHAT WE OFFER ================= */}
      <section className="px-6 py-20 bg-white/50">

        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-14">

            <p className="text-[#FF8A75] font-semibold uppercase tracking-[3px] mb-3">
              Our Collection
            </p>

            <h2 className="text-4xl md:text-5xl font-bold text-[#8B1A24]">
              What We Offer
            </h2>

            <p className="text-gray-600 mt-5 max-w-2xl mx-auto leading-7">
              Explore our collection of carefully selected products created
              to add beauty and style to your everyday life.
            </p>

          </div>


          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Fashion */}
            <div className="rounded-3xl bg-white/70 backdrop-blur-lg border border-white/50 shadow-lg p-7 text-center hover:-translate-y-2 transition duration-300">

              <div className="mx-auto mb-5 h-16 w-16 rounded-full bg-[#FFE5E0] flex items-center justify-center text-3xl">
                👗
              </div>

              <h3 className="text-xl font-bold text-[#8B1A24] mb-3">
                Fashion
              </h3>

              <p className="text-gray-600 leading-7">
                Elegant and stylish fashion products for every occasion.
              </p>

            </div>


            {/* Accessories */}
            <div className="rounded-3xl bg-white/70 backdrop-blur-lg border border-white/50 shadow-lg p-7 text-center hover:-translate-y-2 transition duration-300">

              <div className="mx-auto mb-5 h-16 w-16 rounded-full bg-[#FFE5E0] flex items-center justify-center text-3xl">
                👜
              </div>

              <h3 className="text-xl font-bold text-[#8B1A24] mb-3">
                Accessories
              </h3>

              <p className="text-gray-600 leading-7">
                Beautiful accessories to complete your unique look.
              </p>

            </div>


            {/* Beauty */}
            <div className="rounded-3xl bg-white/70 backdrop-blur-lg border border-white/50 shadow-lg p-7 text-center hover:-translate-y-2 transition duration-300">

              <div className="mx-auto mb-5 h-16 w-16 rounded-full bg-[#FFE5E0] flex items-center justify-center text-3xl">
                💄
              </div>

              <h3 className="text-xl font-bold text-[#8B1A24] mb-3">
                Beauty
              </h3>

              <p className="text-gray-600 leading-7">
                Beauty and lifestyle products selected with care.
              </p>

            </div>


            {/* Jewellery */}
            <div className="rounded-3xl bg-white/70 backdrop-blur-lg border border-white/50 shadow-lg p-7 text-center hover:-translate-y-2 transition duration-300">

              <div className="mx-auto mb-5 h-16 w-16 rounded-full bg-[#FFE5E0] flex items-center justify-center text-3xl">
                💎
              </div>

              <h3 className="text-xl font-bold text-[#8B1A24] mb-3">
                Jewellery
              </h3>

              <p className="text-gray-600 leading-7">
                Elegant pieces that add the perfect finishing touch.
              </p>

            </div>

          </div>

        </div>
      </section>


      {/* ================= WHY CHOOSE US ================= */}
      <section className="px-6 py-20">

        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-14">

            <p className="text-[#FF8A75] font-semibold uppercase tracking-[3px] mb-3">
              Our Promise
            </p>

            <h2 className="text-4xl md:text-5xl font-bold text-[#8B1A24]">
              Why Choose LadyItem?
            </h2>

          </div>


          <div className="grid md:grid-cols-3 gap-8">

            {/* Quality */}
            <div className="rounded-3xl border border-white/40 bg-white/60 backdrop-blur-xl shadow-xl p-8 text-center">

              <div className="mx-auto mb-5 h-16 w-16 rounded-full bg-[#FF8A75]/20 flex items-center justify-center text-3xl">
                ⭐
              </div>

              <h3 className="text-2xl font-bold text-[#8B1A24] mb-4">
                Quality Products
              </h3>

              <p className="text-gray-600 leading-7">
                We focus on providing quality products that offer style,
                comfort, and value.
              </p>

            </div>


            {/* Affordable */}
            <div className="rounded-3xl border border-white/40 bg-white/60 backdrop-blur-xl shadow-xl p-8 text-center">

              <div className="mx-auto mb-5 h-16 w-16 rounded-full bg-[#FF8A75]/20 flex items-center justify-center text-3xl">
                💕
              </div>

              <h3 className="text-2xl font-bold text-[#8B1A24] mb-4">
                Affordable Prices
              </h3>

              <p className="text-gray-600 leading-7">
                Look stylish without spending too much. We offer products at
                prices that suit your budget.
              </p>

            </div>


            {/* Customer */}
            <div className="rounded-3xl border border-white/40 bg-white/60 backdrop-blur-xl shadow-xl p-8 text-center">

              <div className="mx-auto mb-5 h-16 w-16 rounded-full bg-[#FF8A75]/20 flex items-center justify-center text-3xl">
                🤍
              </div>

              <h3 className="text-2xl font-bold text-[#8B1A24] mb-4">
                Customer First
              </h3>

              <p className="text-gray-600 leading-7">
                Your satisfaction is important to us. We work hard to make
                your shopping experience easy and enjoyable.
              </p>

            </div>

          </div>

        </div>
      </section>


      {/* ================= MISSION SECTION ================= */}
      <section className="px-6 py-20">

        <div className="max-w-5xl mx-auto">

          <div className="relative overflow-hidden rounded-3xl bg-[#8B1A24] text-white shadow-2xl p-10 md:p-16 text-center">

            {/* Decorative circles */}
            <div className="absolute top-[-80px] left-[-80px] h-48 w-48 rounded-full bg-[#FF8A75]/30 blur-2xl"></div>

            <div className="absolute bottom-[-80px] right-[-80px] h-48 w-48 rounded-full bg-[#FF8A75]/30 blur-2xl"></div>

            <div className="relative z-10">

              <p className="text-[#FF8A75] font-semibold uppercase tracking-[3px] mb-4">
                Our Mission
              </p>

              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Feel Beautiful. Feel Confident.
              </h2>

              <p className="text-white/80 text-lg leading-8 max-w-3xl mx-auto">
                Our mission is to make stylish and quality women's products
                accessible to everyone. We want every LadyItem customer to
                discover something that makes her feel confident, beautiful,
                and uniquely herself.
              </p>

            </div>

          </div>

        </div>
      </section>


      {/* ================= SHOP NOW CTA ================= */}
      <section className="px-6 pb-20">

        <div className="max-w-6xl mx-auto rounded-3xl border border-white/40 bg-white/60 backdrop-blur-xl shadow-2xl p-10 md:p-16 text-center">

          <p className="text-[#FF8A75] font-semibold uppercase tracking-[3px] mb-4">
            Discover Your Style
          </p>

          <h2 className="text-4xl md:text-5xl font-bold text-[#8B1A24] mb-5">
            Find Something You Love
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto leading-7 mb-8">
            Explore our latest collection and find the perfect products
            to express your personality and style.
          </p>

          <Link
            to="/products"
            className="inline-block px-9 py-3 rounded-full bg-[#8B1A24] text-white font-semibold hover:bg-[#6E121C] transition duration-300 shadow-lg"
          >
            Explore Products
          </Link>

        </div>

      </section>


      {/* ================= FOOTER ================= */}
      <footer className="bg-[#8B1A24] text-white">

        <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-10">

          {/* Brand */}
          <div>

            <h2 className="text-3xl font-bold text-[#FF8A75] mb-4">
              LadyItem
            </h2>

            <p className="text-white/80 leading-7">
              Your destination for elegant fashion, beautiful accessories,
              and stylish products made for modern women.
            </p>

          </div>


          {/* Quick Links */}
          <div>

            <h3 className="text-xl font-semibold mb-5">
              Quick Links
            </h3>

            <div className="flex flex-col gap-3">

              <Link
                to="/"
                className="text-white/80 hover:text-[#FF8A75] transition"
              >
                Home
              </Link>

              <Link
                to="/products"
                className="text-white/80 hover:text-[#FF8A75] transition"
              >
                Products
              </Link>

              <Link
                to="/about"
                className="text-white/80 hover:text-[#FF8A75] transition"
              >
                About Us
              </Link>

              <Link
                to="/contact"
                className="text-white/80 hover:text-[#FF8A75] transition"
              >
                Contact
              </Link>

            </div>

          </div>


          {/* Contact */}
          <div>

            <h3 className="text-xl font-semibold mb-5">
              Contact Us
            </h3>

            <div className="space-y-3 text-white/80">

              <p>📍 Sri Lanka</p>

              <p>📧 support@ladyitem.com</p>

              <p>📞 +94 71 234 5678</p>

            </div>

          </div>

        </div>


        {/* Copyright */}
        <div className="border-t border-white/10">

          <div className="max-w-6xl mx-auto px-6 py-5 text-center text-white/60">
            © 2026 LadyItem. All Rights Reserved.
          </div>

        </div>

      </footer>

    </div>
  );
}