import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill all fields");
      return;
    }

    toast.success("Message sent successfully!");

    setFormData({
      name: "",
      email: "",
      message: "",
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF5F4] via-white to-[#FFE5E0] px-6 py-16">

      {/* Decorative Background */}
      <div className="absolute top-10 left-10 h-60 w-60 rounded-full bg-[#FF8A75]/20 blur-3xl"></div>

      <div className="absolute bottom-10 right-10 h-60 w-60 rounded-full bg-[#8B1A24]/20 blur-3xl"></div>

      {/* Main Card */}
      <div className="relative z-10 max-w-4xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-10">

          <p className="text-[#FF8A75] font-semibold uppercase tracking-[3px]">
            Get In Touch
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-[#8B1A24] mt-3">
            Contact Us
          </h1>

          <p className="text-gray-600 mt-4">
            Have a question? We would love to hear from you.
          </p>

        </div>


        {/* Contact Card */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* Contact Details */}
          <div className="rounded-3xl bg-[#8B1A24] text-white p-8 shadow-xl">

            <h2 className="text-2xl font-bold mb-6">
              Let's Talk
            </h2>

            <p className="text-white/80 leading-7 mb-8">
              Feel free to contact us about products, orders, or any
              questions you may have.
            </p>

            <div className="space-y-5">

              <div>
                <p className="text-[#FF8A75] font-semibold">
                  Email
                </p>
                <p className="text-white/80">
                  support@ladyitem.com
                </p>
              </div>

              <div>
                <p className="text-[#FF8A75] font-semibold">
                  Phone
                </p>
                <p className="text-white/80">
                  +94 71 234 5678
                </p>
              </div>

              <div>
                <p className="text-[#FF8A75] font-semibold">
                  Location
                </p>
                <p className="text-white/80">
                  Sri Lanka
                </p>
              </div>

            </div>

          </div>


          {/* Contact Form */}
          <div className="rounded-3xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl p-8">

            <h2 className="text-2xl font-bold text-[#8B1A24] mb-6">
              Send Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">

              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[#FFF5F4] border border-[#FFE5E0] focus:border-[#FF8A75] focus:outline-none"
              />

              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[#FFF5F4] border border-[#FFE5E0] focus:border-[#FF8A75] focus:outline-none"
              />

              <textarea
                name="message"
                placeholder="Your Message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[#FFF5F4] border border-[#FFE5E0] focus:border-[#FF8A75] focus:outline-none resize-none"
              />

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#8B1A24] text-white font-semibold hover:bg-[#6E121C] transition"
              >
                Send Message
              </button>

            </form>

          </div>

        </div>


        {/* Back to Products */}
        <div className="text-center mt-10">

          <Link
            to="/products"
            className="text-[#8B1A24] font-semibold hover:text-[#FF8A75] transition"
          >
            ← Continue Shopping
          </Link>

        </div>

      </div>

    </div>
  );
}