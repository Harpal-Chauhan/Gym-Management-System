import React, { useState } from "react";
import { toast } from "react-toastify";
import { supabase } from "../lib/supabaseClient";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // VALIDATION
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!formData.password.trim()) {
      toast.error("Password is required");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password,
      });

      // SUPABASE ERROR
      if (error) {
        if (error.message === "Invalid login credentials") {
          toast.error("Invalid email or password");
        } else if (error.message.includes("Email not confirmed")) {
          toast.error("Please confirm your email before login");
        } else {
          toast.error(`Login error: ${error.message}`);
        }

        return;
      }

      // USER CHECK
      if (!data?.user) {
        toast.error("Login error: User account was not found");
        return;
      }

      // SUCCESS
      toast.success("Login successful!");

      setFormData({
        email: "",
        password: "",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      toast.error(`Login request failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0EDE5] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#004643]">
            Gym<span className="text-[#D8A85F]">Flow</span>
          </h1>

          <p className="text-sm text-[#155955] mt-1">Gym Management System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl border border-[#DEDCD2] shadow-lg p-6 sm:p-8">
          <div className="text-center mb-7">
            <h2 className="text-2xl font-bold text-[#004643]">Welcome Back</h2>

            <p className="text-sm text-gray-500 mt-2">
              Login to your GymFlow account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#004643] mb-2"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3.5 border border-[#DEDCD2] rounded-xl bg-[#FAF9F6] text-gray-800 outline-none transition focus:border-[#155955] focus:ring-2 focus:ring-[#155955]/10"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#004643] mb-2"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3.5 border border-[#DEDCD2] rounded-xl bg-[#FAF9F6] text-gray-800 outline-none transition focus:border-[#155955] focus:ring-2 focus:ring-[#155955]/10"
              />
            </div>

            {/* Login Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#004643] text-white py-3.5 rounded-xl font-semibold transition hover:bg-[#155955] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              <Link
                to="/register"
                className="flex-1 text-center bg-[#D8A85F] text-[#004643] py-3.5 rounded-xl font-semibold transition hover:opacity-90"
              >
                Register
              </Link>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-6">
          GymFlow • Gym Management System
        </p>
      </div>
    </div>
  );
};

export default Login;
