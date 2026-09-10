import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { supabase } from "../../lib/supabaseClient";

const AddMember = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    membership_type: "monthly",
    membership_start: "",
    membership_end: "",
    status: "active",
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
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!formData.phone.trim()) {
      toast.error("Phone is required");
      return;
    }

    if (!formData.membership_start) {
      toast.error("Membership start date is required");
      return;
    }

    if (!formData.membership_end) {
      toast.error("Membership end date is required");
      return;
    }

    if (
      new Date(formData.membership_end) < new Date(formData.membership_start)
    ) {
      toast.error("End date cannot be before start date");
      return;
    }

    try {
      setLoading(true);

      // CHECK LOGGED-IN USER
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError) {
        console.error("GET USER ERROR:", userError);
        toast.error(`User fetch error: ${userError.message}`);
        return;
      }

      // CHECK USER
      if (!userData?.user) {
        toast.error("You must be logged in");
        navigate("/login");
        return;
      }

      const currentUser = userData.user;

      // CHECK CURRENT USER ROLE
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", currentUser.id)
        .maybeSingle();

      if (profileError) {
        console.error("PROFILE FETCH ERROR:", profileError);
        toast.error(`Profile fetch error: ${profileError.message}`);
        return;
      }

      if (!profileData) {
        toast.error("Your profile was not found");
        return;
      }

      // ADMIN / MANAGER ONLY
      if (!["admin", "manager"].includes(profileData.role)) {
        toast.error("You don't have permission to add members");
        navigate("/dashboard");
        return;
      }

      // INSERT MEMBER
      const { error: memberError } = await supabase.from("members").insert({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        membership_type: formData.membership_type,
        membership_start: formData.membership_start,
        membership_end: formData.membership_end,
        status: formData.status,
      });

      if (memberError) {
        console.error("ADD MEMBER ERROR:", memberError);

        if (memberError.code === "23505") {
          toast.error("A member with this information already exists");
        } else if (memberError.code === "42501") {
          toast.error("You don't have permission to add members");
        } else {
          toast.error(`Failed to add member: ${memberError.message}`);
        }

        return;
      }

      // SUCCESS
      toast.success("Member added successfully!");

      setFormData({
        name: "",
        email: "",
        phone: "",
        membership_type: "monthly",
        membership_start: "",
        membership_end: "",
        status: "active",
      });

      navigate("/members");
    } catch (error) {
      console.error("ADD MEMBER REQUEST ERROR:", error);
      toast.error(`Request failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0EDE5] md:ml-64 px-4 sm:px-6 lg:px-8 py-20 md:py-10">
      <div className="max-w-3xl mx-auto">
        {/* HEADER */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#004643]">
            Add Member
          </h1>

          <p className="text-sm sm:text-base text-gray-500 mt-1">
            Add a new member to GymFlow
          </p>
        </div>

        {/* FORM CARD */}
        <div className="bg-white border border-[#DEDCD2] rounded-3xl shadow-sm p-5 sm:p-7 lg:p-8">
          {/* CARD HEADER */}
          <div className="flex items-center gap-4 mb-7">
            <div className="w-12 h-12 rounded-2xl bg-[#F0EDE5] flex items-center justify-center">
              <span className="text-[#D8A85F] text-2xl font-bold">+</span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#004643]">
                Member Details
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Enter the member's basic and membership information.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* NAME */}
            <div>
              <label className="block text-sm font-semibold text-[#004643] mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3.5 border border-[#DEDCD2] rounded-xl bg-[#FAF9F6] text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#155955] focus:ring-2 focus:ring-[#155955]/10 transition"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-semibold text-[#004643] mb-2">
                Email
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3.5 border border-[#DEDCD2] rounded-xl bg-[#FAF9F6] text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#155955] focus:ring-2 focus:ring-[#155955]/10 transition"
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="block text-sm font-semibold text-[#004643] mb-2">
                Phone
              </label>

              <input
                type="tel"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3.5 border border-[#DEDCD2] rounded-xl bg-[#FAF9F6] text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#155955] focus:ring-2 focus:ring-[#155955]/10 transition"
              />
            </div>

            {/* MEMBERSHIP TYPE */}
            <div>
              <label className="block text-sm font-semibold text-[#004643] mb-2">
                Membership Type
              </label>

              <select
                name="membership_type"
                value={formData.membership_type}
                onChange={handleChange}
                className="w-full px-4 py-3.5 border border-[#DEDCD2] rounded-xl bg-[#FAF9F6] text-gray-800 outline-none focus:border-[#155955] focus:ring-2 focus:ring-[#155955]/10 transition"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            {/* DATES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-[#004643] mb-2">
                  Membership Start
                </label>

                <input
                  type="date"
                  name="membership_start"
                  value={formData.membership_start}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 border border-[#DEDCD2] rounded-xl bg-[#FAF9F6] text-gray-800 outline-none focus:border-[#155955] focus:ring-2 focus:ring-[#155955]/10 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#004643] mb-2">
                  Membership End
                </label>

                <input
                  type="date"
                  name="membership_end"
                  value={formData.membership_end}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 border border-[#DEDCD2] rounded-xl bg-[#FAF9F6] text-gray-800 outline-none focus:border-[#155955] focus:ring-2 focus:ring-[#155955]/10 transition"
                />
              </div>
            </div>

            {/* STATUS */}
            <div>
              <label className="block text-sm font-semibold text-[#004643] mb-2">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3.5 border border-[#DEDCD2] rounded-xl bg-[#FAF9F6] text-gray-800 outline-none focus:border-[#155955] focus:ring-2 focus:ring-[#155955]/10 transition"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#004643] text-white py-3.5 rounded-xl font-semibold hover:bg-[#155955] transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Adding Member..." : "Add Member"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/members")}
                className="flex-1 bg-[#F0EDE5] text-[#004643] border border-[#DEDCD2] py-3.5 rounded-xl font-semibold hover:bg-[#E5E1D7] transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMember;
