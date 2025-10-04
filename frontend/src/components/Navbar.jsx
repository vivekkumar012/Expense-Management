import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div>
      <nav className="relative z-10 flex justify-between items-center px-8 md:px-16 py-5 bg-[#0f0c29]/80 backdrop-blur-lg">
        <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent tracking-wide">
          <Link to={"/"}>ExpenseFlow</Link>
        </div>
        <div className="flex gap-4">
          <Link
            to={"/login"}
            className="px-8 py-3 rounded-full font-semibold border-2 border-white/30 hover:border-blue-400 hover:shadow-[0_0_20px_rgba(79,172,254,0.4)] transition-all duration-300 cursor-pointer"
          >
            Login
          </Link>
          <Link
            to={"/register"}
            className="px-8 py-3 rounded-full font-semibold bg-gradient-to-r from-purple-500 to-purple-700 hover:shadow-[0_10px_30px_rgba(102,126,234,0.5)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
          >
            Sign Up
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
