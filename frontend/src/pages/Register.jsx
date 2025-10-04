import React, { useState, useEffect } from "react";
import { Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Employee",
    country: "",
  });

  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const roles = ["Admin", "Employee", "Manager"];

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await axios.get(
          "https://restcountries.com/v3.1/all?fields=name,currencies"
        );
        const countryList = res.data
          .filter((c) => c.currencies)
          .map((c) => ({
            name: c.name.common,
            currencies: c.currencies,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setCountries(countryList);
      } catch (err) {
        console.error("Error fetching countries:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedCountry = countries.find(
      (c) => c.name === formData.country
    );

    const currencyCode = selectedCountry
      ? Object.keys(selectedCountry.currencies)[0]
      : null;

    const submissionData = {
      ...formData,
      currency: currencyCode,
    };

    console.log("Submitting:", submissionData);

    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/register",
        submissionData
      );
      if (res.status === 200 || res.status === 201) {
        alert("Registration successful! Please login.");
        navigate("/login");
      }
    } catch (err) {
      console.error("Registration error:", err);
      const message =
        err.response?.data?.message ||
        "Something went wrong! Please try again.";
      alert(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
      <Navbar />

      <div className="flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full mb-4">
              <Users className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-2">
              Create Account
            </h2>
            <p className="text-white/70">Join ExpenseFlow today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all"
            />

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all"
            >
              {roles.map((role) => (
                <option key={role} value={role} className="bg-[#302b63] text-white">
                  {role}
                </option>
              ))}
            </select>

            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all"
            >
              <option value="" className="bg-[#302b63] text-white">
                {loading ? "Loading countries..." : "Select Country"}
              </option>
              {countries.map((country) => {
                const currencyCode = Object.keys(country.currencies)[0];
                return (
                  <option
                    key={country.name}
                    value={country.name}
                    className="bg-[#302b63] text-white"
                  >
                    {country.name} ({currencyCode})
                  </option>
                );
              })}
            </select>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold py-3 rounded-lg hover:shadow-[0_10px_30px_rgba(102,126,234,0.5)] hover:-translate-y-0.5 transition-all duration-300"
            >
              Create Account
            </button>
          </form>

          <p className="mt-6 text-center text-white/70">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-cyan-400 font-medium hover:text-cyan-300 transition-colors"
            >
              Login
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RegisterPage;
