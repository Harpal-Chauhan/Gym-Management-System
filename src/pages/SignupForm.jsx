import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { toast } from "react-toastify";

const SignupForm = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [memberId, setMemberId] = useState(null);

  const [formData, setFormData] = useState({
    emergency_contact: "",
    emergency_phone: "",
    address: "",
    date_of_birth: "",
    notes: "",
  });

  useEffect(() => {
    const getMember = async () => {
      try {
        const { data: userData, error: userError } =
          await supabase.auth.getUser();

        if (userError) {
          console.error("USER ERROR:", userError);
          toast.error(`User error: ${userError.message}`);
          return;
        }

        if (!userData?.user) {
          toast.error("User not found");
          return;
        }

        const { data: member, error: memberError } = await supabase
          .from("members")
          .select("id")
          .eq("user_id", userData.user.id)
          .maybeSingle();

        if (memberError) {
          console.error("MEMBER FETCH ERROR:", memberError);
          toast.error(`Member fetch error: ${memberError.message}`);
          return;
        }

        if (!member) {
          toast.error("Member record not found");
          return;
        }

        setMemberId(member.id);

        const { data: signupForm, error: formError } = await supabase
          .from("signup_forms")
          .select(
            "emergency_contact, emergency_phone, address, date_of_birth, notes",
          )
          .eq("member_id", member.id)
          .maybeSingle();

        if (formError) {
          console.error("SIGNUP FORM FETCH ERROR:", formError);
          toast.error(`Signup from fetch error: ${formError.message}`);
          return;
        }

        if (signupForm) {
          setFormData({
            emergency_contact: signupForm.emergency_contact || "",
            emergency_phone: signupForm.emergency_phone || "",
            address: signupForm.address || "",
            date_of_birth: signupForm.date_of_birth || "",
            notes: signupForm.notes || "",
          });
        }
      } catch (error) {
        console.error("SIGNUP FORM ERROR:", error);
        toast.error(`Signup form error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    getMember();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!memberId) {
      toast.error("Member record not found");
      return;
    }

    try {
      setSaving(true);

      const { data: existingForm, error: existingError } = await supabase
        .from("signup_forms")
        .select("id")
        .eq("member_id", memberId)
        .maybeSingle();

      if (existingError) {
        console.error("EXISTING FORM ERROR:", existingError);
        toast.error(`Form check failed: ${existingError.message}`);
        return;
      }

      if (existingForm) {
        const { error } = await supabase
          .from("signup_forms")
          .update(formData)
          .eq("id", existingForm.id);

        if (error) {
          console.error("FORM UPDATE ERROR:", error);
          toast.error(`Form update failed: ${error.message}`);
          return;
        }

        toast.success("Signup form updated successfully!");
      } else {
        const { error } = await supabase.from("signup_forms").insert({
          member_id: memberId,
          ...formData,
        });

        if (error) {
          console.error("FORM INSERT ERROR:", error);
          toast.error(`Form save failed: ${error.message}`);
          return;
        }

        toast.success("Signup form saved successfully!");
      }
    } catch (error) {
      console.error("FORM SAVE ERROR:", error);
      toast.error(`Form save failed: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0EDE5] flex items-center justify-center px-4">
        <div className="bg-white border border-[#DEDCD2] rounded-2xl px-6 py-5 shadow-sm">
          <p className="text-[#004643] font-medium">Loading signup form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0EDE5] md:ml-64 p-4 sm:p-6 lg:p-8 pt-20 md:pt-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#004643]">
            Signup Form
          </h1>

          <p className="text-sm sm:text-base text-gray-500 mt-1">
            Complete your additional member information.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-[#DEDCD2] rounded-3xl shadow-sm p-5 sm:p-6 lg:p-8">
          {/* Card Header */}
          <div className="flex items-center gap-4 mb-7">
            <div className="w-12 h-12 rounded-2xl bg-[#F0EDE5] flex items-center justify-center text-[#D8A85F] text-xl font-bold">
              +
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#004643]">
                Member Information
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Please provide your additional details.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Emergency Contact */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-[#004643]">
                Emergency Contact
              </label>

              <input
                type="text"
                name="emergency_contact"
                placeholder="Enter emergency contact name"
                value={formData.emergency_contact}
                onChange={handleChange}
                className="w-full px-4 py-3.5 border border-[#DEDCD2] rounded-xl bg-[#FAF9F6] text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#155955] focus:ring-2 focus:ring-[#155955]/10 transition"
              />
            </div>

            {/* Emergency Phone */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-[#004643]">
                Emergency Phone
              </label>

              <input
                type="text"
                name="emergency_phone"
                placeholder="Enter emergency phone number"
                value={formData.emergency_phone}
                onChange={handleChange}
                className="w-full px-4 py-3.5 border border-[#DEDCD2] rounded-xl bg-[#FAF9F6] text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#155955] focus:ring-2 focus:ring-[#155955]/10 transition"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-[#004643]">
                Address
              </label>

              <textarea
                name="address"
                placeholder="Enter your address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3.5 border border-[#DEDCD2] rounded-xl bg-[#FAF9F6] text-gray-800 placeholder:text-gray-400 outline-none resize-none focus:border-[#155955] focus:ring-2 focus:ring-[#155955]/10 transition"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-[#004643]">
                Date of Birth
              </label>

              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                className="w-full px-4 py-3.5 border border-[#DEDCD2] rounded-xl bg-[#FAF9F6] text-gray-800 outline-none focus:border-[#155955] focus:ring-2 focus:ring-[#155955]/10 transition"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-[#004643]">
                Notes
              </label>

              <textarea
                name="notes"
                placeholder="Add any additional notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3.5 border border-[#DEDCD2] rounded-xl bg-[#FAF9F6] text-gray-800 placeholder:text-gray-400 outline-none resize-none focus:border-[#155955] focus:ring-2 focus:ring-[#155955]/10 transition"
              />
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-[#004643] text-white py-3.5 rounded-xl font-semibold hover:bg-[#155955] transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Signup Form"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
