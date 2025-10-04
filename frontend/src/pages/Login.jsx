import React, { useState } from "react";
import { LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("Logging in with:", formData);

    try {
      const res = await axios.post("http://localhost:5000/api/v1/user/login", formData);
      
      if (res.status === 200) {
        // Store token in localStorage
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        
        alert("Login successful!");
        
        // Navigate based on role
        const role = res.data.user.role;
        if (role === "Admin") {
          navigate("/admin/dashboard");
        } else if (role === "Manager") {
          navigate("/manager/dashboard");
        } else if (role === "Employee") {
          navigate("/employee/dashboard");
        }
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert("Invalid credentials! Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
      <Navbar />
      
      <div className="flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mb-4">
              <LogIn className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-white/70">Login to your ExpenseFlow account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold py-3 rounded-lg hover:shadow-[0_10px_30px_rgba(102,126,234,0.5)] hover:-translate-y-0.5 transition-all duration-300"
            >
              Login
            </button>
          </form>

          <div className="mt-4 text-right">
            <Link 
              to="/forgot-password" 
              className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          <p className="mt-6 text-center text-white/70">
            Don't have an account?{" "}
            <Link 
              to="/register" 
              className="text-cyan-400 font-medium hover:text-cyan-300 transition-colors"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default LoginPage;