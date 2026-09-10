import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { toast } from "react-toastify";

const Setting = () => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError) {
        console.error("USER FETCH ERROR:", userError);
        toast.error(`Failed to load account: ${userError.message}`);
        return;
      }

      if (!userData?.user) {
        toast.error("User not found");
        return;
      }

      setUser(userData.user);

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("name, email, role")
        .eq("user_id", userData.user.id)
        .maybeSingle();

      if (profileError) {
        console.error("PROFILE FETCH ERROR:", profileError);
        toast.error(`Failed to load profile: ${profileError.message}`);
        return;
      }

      setProfile(profileData);
    } catch (error) {
      console.error("SETTINGS ERROR:", error);
      toast.error(`Something went wrong: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("LOGOUT ERROR:", error);
        toast.error(`Logout failed: ${error.message}`);
        return;
      }

      toast.success("Logged out successfully");
      window.location.href = "/login";
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
      toast.error(`Logout failed: ${error.message}`);
    }
  };

  const getInitial = () => {
    if (profile?.name) {
      return profile.name.charAt(0).toUpperCase();
    }

    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }

    return "U";
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F0EDE5] md:ml-64 p-4 sm:p-6 lg:p-8 pt-20 md:pt-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#D8D2BF] border-t-[#004643] rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-[#004643] font-medium">Loading settings...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F0EDE5] md:ml-64 p-4 sm:p-6 lg:p-8 pt-20 md:pt-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-[#D8A85F] mb-2">ACCOUNT</p>

          <h1 className="text-3xl sm:text-4xl font-bold text-[#004643]">
            Settings
          </h1>

          <p className="text-[#687572] mt-2">Manage your account settings.</p>
        </div>

        {/* Account Information */}
        <div className="bg-white border border-[#DEDCD2] rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-[#004643] text-[#F0EDE5] flex items-center justify-center text-2xl font-bold border-2 border-[#D8A85F]">
              {getInitial()}
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#004643]">
                Account Information
              </h2>

              <p className="text-sm text-[#687572] mt-1">
                Your GymFlow account details
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Name */}
            <div>
              <p className="text-sm font-medium text-[#7A8581] mb-2">Name</p>

              <div className="border border-[#DEDCD2] rounded-xl px-4 py-3 text-[#004643] font-medium bg-[#FAFAF7]">
                {profile?.name || "-"}
              </div>
            </div>

            {/* Email */}
            <div>
              <p className="text-sm font-medium text-[#7A8581] mb-2">Email</p>

              <div className="border border-[#DEDCD2] rounded-xl px-4 py-3 text-[#004643] font-medium bg-[#FAFAF7] break-all">
                {profile?.email || user?.email || "-"}
              </div>
            </div>

            {/* Role */}
            <div>
              <p className="text-sm font-medium text-[#7A8581] mb-2">Role</p>

              <div className="border border-[#DEDCD2] rounded-xl px-4 py-3 text-[#004643] font-semibold bg-[#FAFAF7] capitalize">
                {profile?.role || "-"}
              </div>
            </div>
          </div>

          {/* Logout */}
          <div className="mt-8 pt-6 border-t border-[#DEDCD2]">
            <button
              onClick={handleLogout}
              className="px-5 py-3 rounded-xl bg-[#004643] text-white font-semibold hover:bg-[#155955] transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Setting;
