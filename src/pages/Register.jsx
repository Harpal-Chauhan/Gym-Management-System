import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(true);
  const [invite, setInvite] = useState(null);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // CHECK INVITE
  useEffect(() => {
    const checkInvite = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        // Normal registration
        if (!token) {
          setInviteLoading(false);
          return;
        }

        // Find pending invite
        const { data, error } = await supabase.rpc("get_pending_invite", {
          invite_token: token,
        });

        if (error) {
          console.error("INVITE FETCH ERROR:", error);
          toast.error(`Invite verification failed: ${error.message}`);
          setInviteLoading(false);
          return;
        }

        if (!data || data.length === 0) {
          toast.error("Invalid or already used invite");
          setInviteLoading(false);
          return;
        }

        const inviteData = data[0];

        setInvite(inviteData);

        // Set invited email
        setFormData((prev) => ({
          ...prev,
          email: inviteData.email || "",
        }));
      } catch (error) {
        console.error("INVITE CHECK ERROR:", error);
        toast.error(`Invite check failed: ${error.message}`);
      } finally {
        setInviteLoading(false);
      }
    };

    checkInvite();
  }, []);

  // INPUT CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // REGISTER
  const handleSubmit = async (e) => {
    e.preventDefault();

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    // If invite link is used but invite is invalid
    if (token && !invite) {
      toast.error("Please use a valid invite link");
      return;
    }

    // VALIDATION
    if (!formData.name || !formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!formData.email || !formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!formData.password.trim()) {
      toast.error("Password is required");
      return;
    }

    if (!formData.confirmPassword.trim()) {
      toast.error("Please confirm your password");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      // SUPABASE AUTH REGISTER
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,

        options: {
          data: {
            name: formData.name.trim(),
            invite_token: token || null,
          },
        },
      });

      // SUPABASE ERROR
      if (error) {
        console.error("REGISTER SUPABASE ERROR:", error);

        if (error.message.includes("already registered")) {
          toast.error("This email is already registered")
          navigate('/login')
        } else if (error.message.includes("rate limit")) {
          toast.error(
            "Too many registration attempts. Please try again later.",
          );
        } else if (error.message.includes("Password")) {
          toast.error(`Password error: ${error.message}`);
        } else if (error.message.includes("email")) {
          toast.error(`Email error: ${error.message}`);
        } else {
          toast.error(`Registration error: ${error.message}`);
        }

        return;
      }

      // USER CHECK
      if (!data?.user) {
        toast.error("Registration error: User was not created");
        return;
      }

      // SUCCESS
      toast.success("Registration successful!");
      // RESET FORM
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // LOGIN PAGE
      navigate("/login");
    } catch (error) {
      console.error("REGISTER REQUEST ERROR:", error);
      toast.error(`Registration request failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // INVITE LOADING
  if (inviteLoading) {
    return (
      <div className="min-h-screen bg-[#F0EDE5] flex items-center justify-center px-4">
        <div className="bg-white border border-[#DEDCD2] rounded-2xl px-6 py-5 shadow-sm">
          <p className="text-[#004643] font-medium">Checking invite...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0EDE5] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#004643]">
            Gym<span className="text-[#D8A85F]">Flow</span>
          </h1>

          <p className="text-sm text-[#155955] mt-1">Gym Management System</p>
        </div>

        {/* Register Card */}
        <div className="bg-white border border-[#DEDCD2] rounded-3xl shadow-lg p-6 sm:p-8">
          {/* Heading */}
          <div className="text-center mb-7">
            <h2 className="text-2xl font-bold text-[#004643]">
              {invite ? "Complete Your Signup" : "Create Account"}
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              {invite
                ? `You have been invited as ${invite.role}`
                : "Create your GymFlow account"}
            </p>
          </div>

          {/* Invite Role */}
          {invite && (
            <div className="mb-5 bg-[#F0EDE5] border border-[#DEDCD2] rounded-xl px-4 py-3">
              <p className="text-xs text-gray-500">Invited Role</p>

              <p className="text-sm font-semibold text-[#004643] capitalize mt-1">
                {invite.role}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-[#004643] mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3.5 border border-[#DEDCD2] rounded-xl bg-[#FAF9F6] text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-[#155955] focus:ring-2 focus:ring-[#155955]/10"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-[#004643] mb-2">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                readOnly={!!invite}
                className={`w-full px-4 py-3.5 border border-[#DEDCD2] rounded-xl text-gray-800 placeholder:text-gray-400 outline-none transition ${
                  invite
                    ? "bg-gray-100 cursor-not-allowed"
                    : "bg-[#FAF9F6] focus:border-[#155955] focus:ring-2 focus:ring-[#155955]/10"
                }`}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-[#004643] mb-2">
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3.5 border border-[#DEDCD2] rounded-xl bg-[#FAF9F6] text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-[#155955] focus:ring-2 focus:ring-[#155955]/10"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-[#004643] mb-2">
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3.5 border border-[#DEDCD2] rounded-xl bg-[#FAF9F6] text-gray-800 placeholder:text-gray-400 outline-none transition focus:border-[#155955] focus:ring-2 focus:ring-[#155955]/10"
              />
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#004643] text-white py-3.5 rounded-xl font-semibold hover:bg-[#155955] transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
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

export default Register;
