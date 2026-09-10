import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { supabase } from "../lib/supabaseClient";

const InviteUser = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    role: "trainer",
  });

  const [inviteLink, setInviteLink] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      toast.success("Invite link copied!");
    } catch (error) {
      console.error("COPY LINK ERROR:", error);
      toast.error("Failed to copy invite link");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // EMAIL VALIDATION
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    try {
      setLoading(true);

      // GET LOGGED-IN USER
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError) {
        console.error("GET USER ERROR:", userError);
        toast.error(`User fetch error: ${userError.message}`);
        return;
      }

      if (!userData?.user) {
        toast.error("You must be logged in");
        navigate("/login");
        return;
      }

      // GET CURRENT USER PROFILE
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", userData.user.id)
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

      // ONLY ADMIN CAN INVITE
      if (profileData.role !== "admin") {
        toast.error("Only admin can invite users");
        navigate("/dashboard");
        return;
      }

      // CREATE INVITE
      const { data: inviteData, error: inviteError } = await supabase
        .from("invites")
        .insert({
          email: formData.email.trim(),
          role: formData.role,
          invited_by: userData.user.id,
        })
        .select("id, token")
        .single();

      // INVITE ERROR
      if (inviteError) {
        console.error("INVITE ERROR:", inviteError);

        if (inviteError.code === "23505") {
          toast.error("This invite already exists");
        } else if (inviteError.code === "42501") {
          toast.error("You don't have permission to create invites");
        } else {
          toast.error(`Invite error: ${inviteError.message}`);
        }

        return;
      }

      // SUCCESS
      const signupLink = `${window.location.origin}/register?token=${inviteData.token}`;

      setInviteLink(signupLink);

      toast.success(
        `Invite created for ${formData.email.trim()} as ${formData.role}`,
      );

      // console.log("SIGNUP LINK:", signupLink);

      setFormData({
        email: "",
        role: "trainer",
      });
    } catch (error) {
      console.error("INVITE REQUEST ERROR:", error);
      toast.error(`Invite request failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-screen
        bg-[#F0EDE5]
        md:ml-64
        flex
        items-center
        justify-center
        px-4
        sm:px-6
        py-20
        md:py-10
      "
    >
      {/* ================= CARD ================= */}

      <div
        className="
          w-full
          max-w-lg
          bg-white
          rounded-3xl
          border border-[#DEDCD2]
          shadow-[0_15px_40px_rgba(0,70,67,0.10)]
          overflow-hidden
        "
      >
        {/* ================= CARD HEADER ================= */}

        <div
          className="
            bg-[#004643]
            px-6
            sm:px-8
            py-7
            relative
            overflow-hidden
          "
        >
          {/* Decorative Circle */}

          <div
            className="
              absolute
              -right-10
              -top-16
              w-40
              h-40
              rounded-full
              border-[30px]
              border-[#D8A85F]/20
            "
          ></div>

          <div className="relative">
            <div
              className="
                w-12
                h-12
                rounded-xl
                bg-[#F0EDE5]
                text-[#004643]
                flex
                items-center
                justify-center
                font-bold
                text-xl
                mb-4
              "
            >
              +
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-[#F0EDE5]">
              Invite User
            </h1>

            <p className="text-[#B8CECA] mt-2 text-sm sm:text-base">
              Invite a new GymFlow user.
            </p>
          </div>
        </div>

        {/* ================= FORM ================= */}

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* EMAIL */}

          <div>
            <label
              htmlFor="email"
              className="
                block
                text-sm
                font-semibold
                text-[#004643]
                mb-2
              "
            >
              User Email
            </label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter user email"
              value={formData.email}
              onChange={handleChange}
              className="
                w-full
                px-4
                py-3.5
                bg-[#F8F6F0]
                border border-[#DCD9CE]
                rounded-xl
                text-[#004643]
                placeholder:text-[#9A9F9C]
                outline-none
                transition
                focus:border-[#004643]
                focus:ring-2
                focus:ring-[#004643]/10
              "
            />
          </div>

          {/* ROLE */}

          <div>
            <label
              htmlFor="role"
              className="
                block
                text-sm
                font-semibold
                text-[#004643]
                mb-2
              "
            >
              Select Role
            </label>

            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="
                w-full
                px-4
                py-3.5
                bg-[#F8F6F0]
                border border-[#DCD9CE]
                rounded-xl
                text-[#004643]
                outline-none
                cursor-pointer
                transition
                focus:border-[#004643]
                focus:ring-2
                focus:ring-[#004643]/10
              "
            >
              <option value="manager">Manager</option>
              <option value="trainer">Trainer</option>
            </select>
          </div>

          {/* ROLE INFO */}

          <div
            className="
              flex
              gap-3
              bg-[#F0EDE5]
              border border-[#E2DED3]
              rounded-2xl
              p-4
            "
          >
            <div
              className="
                w-9
                h-9
                shrink-0
                rounded-lg
                bg-[#004643]
                text-[#F0EDE5]
                flex
                items-center
                justify-center
                font-bold
              "
            >
              i
            </div>

            <div>
              <p className="text-sm font-semibold text-[#004643]">Invitation</p>

              <p className="text-xs sm:text-sm text-[#6F7B78] mt-1">
                The selected role will be assigned when the invited user
                completes registration.
              </p>
            </div>
          </div>
          {inviteLink && (
            <div className="mt-6 p-4 bg-[#F0EDE5] border border-[#DEDCD2] rounded-xl">
              <p className="text-sm font-semibold text-[#004643] mb-2">
                Invite Link
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={inviteLink}
                  readOnly
                  className="flex-1 px-4 py-3 rounded-xl border border-[#DEDCD2] bg-white text-sm text-gray-600 outline-none"
                />

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-5 py-3 rounded-xl bg-[#004643] text-white font-semibold hover:bg-[#155955] transition"
                >
                  Copy Link
                </button>
              </div>
            </div>
          )}

          {/* CREATE INVITE */}

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              bg-[#004643]
              text-[#F0EDE5]
              py-3.5
              rounded-xl
              font-semibold
              hover:bg-[#155955]
              disabled:opacity-60
              disabled:cursor-not-allowed
              transition
              shadow-md
            "
          >
            {loading ? "Creating Invite..." : "Create Invite"}
          </button>

          {/* BACK */}

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="
              w-full
              bg-[#F0EDE5]
              text-[#004643]
              border border-[#D8D4C9]
              py-3.5
              rounded-xl
              font-semibold
              hover:bg-[#E5E1D6]
              transition
            "
          >
            ← Back to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default InviteUser;
