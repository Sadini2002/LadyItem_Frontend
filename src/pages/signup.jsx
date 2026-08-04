import { Link } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";

export default function Signup() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#FFF5F4] via-white to-[#FFE5E0] flex items-center justify-center px-6 relative overflow-hidden">


      {/* Background Blur Effects */}

      <div className="absolute top-10 left-10 w-72 h-72 bg-[#FF8A75]/30 rounded-full blur-3xl"></div>

      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#8B1A24]/20 rounded-full blur-3xl"></div>



      {/* Signup Card */}

      <div
        className="
        relative z-10 
        w-full max-w-md
        bg-white/60
        backdrop-blur-xl
        border border-white/40
        rounded-3xl
        shadow-2xl
        p-8
        "
      >


        {/* Logo */}

        <h1 className="text-center text-4xl font-bold text-[#8B1A24] mb-2">
          LadyItem
        </h1>


        <p className="text-center text-gray-600 mb-8">
          Create your account and start shopping
        </p>




        <form className="space-y-5">


          {/* Name */}

          <div>

            <label className="text-sm font-medium text-[#121212]">
              Full Name
            </label>


            <div className="relative mt-2">

              <User
                size={20}
                className="absolute left-3 top-3 text-[#8B1A24]"
              />


              <input
                type="text"
                placeholder="Enter your name"
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





          {/* Email */}

          <div>

            <label className="text-sm font-medium text-[#121212]">
              Email Address
            </label>


            <div className="relative mt-2">

              <Mail
                size={20}
                className="absolute left-3 top-3 text-[#8B1A24]"
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
                size={20}
                className="absolute left-3 top-3 text-[#8B1A24]"
              />


              <input
                type="password"
                placeholder="Create password"
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





          {/* Confirm Password */}

          <div>

            <label className="text-sm font-medium text-[#121212]">
              Confirm Password
            </label>


            <div className="relative mt-2">

              <Lock
                size={20}
                className="absolute left-3 top-3 text-[#8B1A24]"
              />


              <input
                type="password"
                placeholder="Confirm password"
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





          {/* Terms */}

          <div className="flex items-center gap-2 text-sm text-gray-600">

            <input
              type="checkbox"
              className="accent-[#8B1A24]"
            />

            <span>
              I agree to the Terms & Conditions
            </span>

          </div>





          {/* Signup Button */}

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

            Create Account

          </button>



        </form>





        {/* Login Link */}

        <p className="text-center text-gray-600 mt-6">

          Already have an account?

          <Link
            to="/login"
            className="
            ml-2
            text-[#8B1A24]
            font-semibold
            hover:underline
            "
          >

            Login

          </Link>


        </p>


      </div>


    </div>
  );
}