import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/login", { email, password });
      console.log(response.data);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#FFF5F4] via-white to-[#FFE5E0] flex items-center justify-center px-6 relative overflow-hidden">


      {/* Background Blur Effects */}

      <div className="absolute top-20 left-10 w-72 h-72 bg-[#FF8A75]/30 rounded-full blur-3xl"></div>

      <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#8B1A24]/20 rounded-full blur-3xl"></div>



      {/* Login Card */}

      <div className="relative z-10 w-full max-w-md 
      bg-white/60 
      backdrop-blur-xl
      border border-white/40
      rounded-3xl
      shadow-2xl
      p-8">


        {/* Logo */}

        <h1 className="text-center text-4xl font-bold text-[#8B1A24] mb-2">
          LadyItem
        </h1>


        <p className="text-center text-gray-600 mb-8">
          Welcome back! Login to your account
        </p>



        <form className="space-y-5">


          {/* Email */}

          <div>

            <label className="text-sm font-medium text-[#121212]">
              Email Address
            </label>


            <div className="relative mt-2">

              <Mail 
                className="absolute left-3 top-3 text-[#8B1A24]"
                size={20}
              />


              <input
                type="email"
                placeholder="Enter your email"
                className="
                w-full
                pl-11
                py-3
                rounded-xl
                border
                border-gray-200
                outline-none
                focus:ring-2
                focus:ring-[#8B1A24]
                "
              />

            </div>

          </div>




          {/* Password */}

          <div>

            <label className="text-sm font-medium text-[#121212]">
              Password
            </label>


            <div className="relative mt-2">


              <Lock
                className="absolute left-3 top-3 text-[#8B1A24]"
                size={20}
              />


              <input
                type="password"
                placeholder="Enter your password" className=" w-full pl-11 py-3 rounded-xl border border-gray-200 outline-none
                focus:ring-2
                focus:ring-[#8B1A24]
                "
              />

            </div>


          </div>



          {/* Remember + Forgot */}

          <div className="flex justify-between items-center text-sm">


            <label className="flex items-center gap-2">

              <input 
                type="checkbox"
                className="accent-[#8B1A24]"
              />

              Remember me

            </label>



            <Link
              to="/forgot-password"
              className="text-[#8B1A24] hover:underline"
            >
              Forgot Password?
            </Link>


          </div>





          {/* Login Button */}

          <button
            type="submit"
            className="
            w-full
            py-3
            rounded-xl
            bg-[#8B1A24]
            text-white
            font-semibold
            hover:bg-[#FF8A75]
            transition
            duration-300
            shadow-lg
            "
          >

            Login

          </button>



        </form>





        {/* Signup */}

        <p className="text-center text-gray-600 mt-6">

          Don't have an account?

          <Link
            to="/signup"
            className="
            ml-2
            text-[#8B1A24]
            font-semibold
            hover:underline
            "
          >

            Create Account

          </Link>


        </p>



      </div>


    </div>
  );
}