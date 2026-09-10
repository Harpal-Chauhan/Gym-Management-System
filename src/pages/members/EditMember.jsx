import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { toast } from "react-toastify";

const EditMember = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    membership_type: "",
    membership_start: "",
    membership_end: "",
    status: "active",
  });

  useEffect(() => {
    fetchMember();
  }, [id]);

  const fetchMember = async () => {
    try {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("FETCH MEMBER ERROR:", error);
        toast.error(`Failed to load member: ${error.message}`);
        return;
      }

      if (!data) {
        toast.error("Member not found");
        navigate("/members");
        return;
      }

      setFormData({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        membership_type: data.membership_type || "",
        membership_start: data.membership_start || "",
        membership_end: data.membership_end || "",
        status: data.status || "active",
      });
    } catch (error) {
      console.error("FETCH MEMBER ERROR:", error);
      toast.error(`Something went wrong: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (
      formData.membership_start &&
      formData.membership_end &&
      formData.membership_end < formData.membership_start
    ) {
      toast.error("Membership end date cannot be before start date");
      return;
    }

    try {
      setSaving(true);

      const { error } = await supabase
        .from("members")
        .update({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          membership_type: formData.membership_type,
          membership_start: formData.membership_start || null,
          membership_end: formData.membership_end || null,
          status: formData.status,
        })
        .eq("id", id);

      if (error) {
        console.error("UPDATE MEMBER ERROR:", error);
        toast.error(`Failed to update member: ${error.message}`);
        return;
      }

      toast.success("Member updated successfully!");
      navigate("/members");
    } catch (error) {
      console.error("UPDATE MEMBER ERROR:", error);
      toast.error(`Something went wrong: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0EDE5] flex items-center justify-center px-4">
        <div className="bg-white border border-[#DEDCD2] rounded-2xl px-6 py-5 shadow-sm">
          <p className="text-[#004643] font-medium">Loading member...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0EDE5] md:ml-64 px-4 sm:px-6 lg:px-8 py-20 md:py-10">
      <div className="max-w-3xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#004643]">
              Edit Member
            </h1>

            <p className="text-sm sm:text-base text-gray-500 mt-1">
              Update member information
            </p>
          </div>

          <button
            onClick={() => navigate("/members")}
            className="w-full sm:w-auto px-5 py-2.5 bg-white border border-[#DEDCD2] text-[#004643] rounded-xl font-semibold hover:bg-[#F0EDE5] transition"
          >
            Back
          </button>
        </div>

        {/* FORM CARD */}
        <div className="bg-white border border-[#DEDCD2] rounded-3xl shadow-sm p-5 sm:p-7 lg:p-8">
          {/* CARD HEADER */}
          <div className="flex items-center gap-4 mb-7">
            <div className="w-12 h-12 rounded-2xl bg-[#F0EDE5] flex items-center justify-center">
              <span className="text-[#D8A85F] text-xl font-bold">✎</span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#004643]">
                Member Details
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Update the member's personal and membership details.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* NAME */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-[#004643]">
                Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter member name"
                className="w-full px-4 py-3.5 border border-[#DEDCD2] rounded-xl bg-[#FAF9F6] text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#155955] focus:ring-2 focus:ring-[#155955]/10 transition"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-[#004643]">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="w-full px-4 py-3.5 border border-[#DEDCD2] rounded-xl bg-[#FAF9F6] text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#155955] focus:ring-2 focus:ring-[#155955]/10 transition"
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-[#004643]">
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone"
                className="w-full px-4 py-3.5 border border-[#DEDCD2] rounded-xl bg-[#FAF9F6] text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#155955] focus:ring-2 focus:ring-[#155955]/10 transition"
              />
            </div>

            {/* MEMBERSHIP TYPE */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-[#004643]">
                Membership Type
              </label>

              <select
                name="membership_type"
                value={formData.membership_type}
                onChange={handleChange}
                className="w-full px-4 py-3.5 border border-[#DEDCD2] rounded-xl bg-[#FAF9F6] text-gray-800 outline-none focus:border-[#155955] focus:ring-2 focus:ring-[#155955]/10 transition"
              >
                <option value="">Select membership</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            {/* DATES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block mb-2 text-sm font-semibold text-[#004643]">
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
                <label className="block mb-2 text-sm font-semibold text-[#004643]">
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
              <label className="block mb-2 text-sm font-semibold text-[#004643]">
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

            {/* UPDATE BUTTON */}
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-[#004643] text-white py-3.5 rounded-xl font-semibold hover:bg-[#155955] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Updating..." : "Update Member"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditMember;
