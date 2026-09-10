import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { supabase } from "../lib/supabaseClient";

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [memberData, setMemberData] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        // Get logged-in user
        const { data, error } = await supabase.auth.getUser();

        if (error) {
          console.error("GET USER ERROR:", error);
          toast.error(`User fetch error: ${error.message}`);
          setLoading(false);
          return;
        }

        if (!data?.user) {
          toast.error("User not found");
          setLoading(false);
          return;
        }

        setUser(data.user);

        // Get profile
        const { data: profileData, error: profileError } =
          await supabase
            .from("profiles")
            .select("name, email, role")
            .eq("user_id", data.user.id)
            .maybeSingle();

        if (profileError) {
          console.error("PROFILE FETCH ERROR:", profileError);
          toast.error(`Profile fetch error: ${profileError.message}`);
          setLoading(false);
          return;
        }

        if (!profileData) {
          toast.error("Profile not found");
          setLoading(false);
          return;
        }

        setProfile(profileData);

        // Get member information
        if (profileData.role === "member") {
          const { data: member, error: memberError } =
            await supabase
              .from("members")
              .select(
                "name, email, phone, membership_type, membership_start, membership_end, status"
              )
              .eq("user_id", data.user.id)
              .maybeSingle();

          if (memberError) {
            console.error("MEMBER FETCH ERROR:", memberError);
            toast.error(`Member fetch error: ${memberError.message}`);
          } else {
            setMemberData(member);
          }
        }
      } catch (error) {
        console.error("DASHBOARD ERROR:", error);
        toast.error(`Dashboard error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0EDE5]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#D8D2BF] border-t-[#004643] rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-[#5F6F6D] font-medium">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* <Navbar /> */}

      {/* ================= MAIN CONTENT ================= */}

      <main className="md:ml-64 min-h-screen bg-[#F0EDE5] p-4 sm:p-6 lg:p-8 pt-20 md:pt-8">

        <div className="max-w-7xl mx-auto">

          {/* ================= HEADER ================= */}

          <div className="mb-8">
            <p className="text-sm font-medium text-[#6A7774] mb-2">
              Welcome back
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-[#004643] tracking-tight">
                  GymFlow Dashboard
                </h1>

                <p className="text-[#687572] mt-2">
                  Manage your gym activities from one place.
                </p>
              </div>

              {/* Role */}
              {profile?.role && (
                <div>
                  <span
                    className="
                      inline-flex
                      items-center
                      px-4
                      py-2
                      rounded-full
                      bg-[#004643]
                      text-[#F0EDE5]
                      text-sm
                      font-semibold
                      capitalize
                      shadow-sm
                    "
                  >
                    {profile.role}
                  </span>
                </div>
              )}

            </div>
          </div>

          {/* ================= WELCOME CARD ================= */}

          <div
            className="
              bg-[#004643]
              rounded-3xl
              p-6 sm:p-8
              mb-6
              shadow-[0_12px_35px_rgba(0,70,67,0.18)]
              relative
              overflow-hidden
            "
          >
            {/* Decorative Circle */}
            <div
              className="
                absolute
                -right-16
                -top-16
                w-48
                h-48
                rounded-full
                border-[35px]
                border-[#D8A85F]/20
              "
            ></div>

            <div
              className="
                absolute
                -right-10
                -bottom-20
                w-40
                h-40
                rounded-full
                bg-[#D8A85F]/10
              "
            ></div>

            <div className="relative flex items-center gap-4">

              {/* Avatar */}
              <div
                className="
                  w-16 h-16
                  rounded-2xl
                  bg-[#F0EDE5]
                  text-[#004643]
                  flex
                  items-center
                  justify-center
                  text-2xl
                  font-bold
                  shadow-lg
                  shrink-0
                "
              >
                {profile?.name
                  ? profile.name.charAt(0).toUpperCase()
                  : user?.email
                  ? user.email.charAt(0).toUpperCase()
                  : "U"}
              </div>

              <div className="min-w-0">
                <p className="text-[#B8CECA] text-sm mb-1">
                  Welcome back
                </p>

                <h2 className="text-xl sm:text-2xl font-bold text-[#F0EDE5] truncate">
                  {profile?.name || user?.email || "User"}
                </h2>

                <p className="text-[#D8A85F] text-sm capitalize mt-1">
                  {profile?.role || "user"}
                </p>
              </div>

            </div>
          </div>

          {/* ================= USER INFORMATION ================= */}

          {user && (
            <section
              className="
                bg-white
                rounded-3xl
                border border-[#DEDCD2]
                p-5 sm:p-7
                mb-6
                shadow-[0_8px_25px_rgba(0,70,67,0.06)]
              "
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1.5 h-6 rounded-full bg-[#D8A85F]"></div>

                <h2 className="text-xl font-bold text-[#004643]">
                  User Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Email */}
                <div
                  className="
                    bg-[#F0EDE5]
                    border border-[#E1DED3]
                    rounded-2xl
                    p-5
                    hover:border-[#D8A85F]
                    transition
                  "
                >
                  <p className="text-xs uppercase tracking-wider font-semibold text-[#7A8581]">
                    Email
                  </p>

                  <p className="text-[#004643] font-semibold mt-2 break-all">
                    {user.email}
                  </p>
                </div>

                {/* User ID */}
                <div
                  className="
                    bg-[#F0EDE5]
                    border border-[#E1DED3]
                    rounded-2xl
                    p-5
                    hover:border-[#D8A85F]
                    transition
                  "
                >
                  <p className="text-xs uppercase tracking-wider font-semibold text-[#7A8581]">
                    User ID
                  </p>

                  <p className="text-[#004643] font-medium mt-2 break-all text-sm">
                    {user.id}
                  </p>
                </div>

              </div>
            </section>
          )}

          {/* ================= PROFILE INFORMATION ================= */}

          {profile && (
            <section
              className="
                bg-white
                rounded-3xl
                border border-[#DEDCD2]
                p-5 sm:p-7
                mb-6
                shadow-[0_8px_25px_rgba(0,70,67,0.06)]
              "
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1.5 h-6 rounded-full bg-[#D8A85F]"></div>

                <h2 className="text-xl font-bold text-[#004643]">
                  Profile Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Name */}
                <div
                  className="
                    bg-[#F0EDE5]
                    border border-[#E1DED3]
                    rounded-2xl
                    p-5
                    hover:border-[#D8A85F]
                    transition
                  "
                >
                  <p className="text-xs uppercase tracking-wider font-semibold text-[#7A8581]">
                    Name
                  </p>

                  <p className="text-[#004643] font-semibold mt-2">
                    {profile.name || "-"}
                  </p>
                </div>

                {/* Email */}
                <div
                  className="
                    bg-[#F0EDE5]
                    border border-[#E1DED3]
                    rounded-2xl
                    p-5
                    hover:border-[#D8A85F]
                    transition
                  "
                >
                  <p className="text-xs uppercase tracking-wider font-semibold text-[#7A8581]">
                    Email
                  </p>

                  <p className="text-[#004643] font-semibold mt-2 break-all">
                    {profile.email || "-"}
                  </p>
                </div>

                {/* Role */}
                <div
                  className="
                    bg-[#F0EDE5]
                    border border-[#E1DED3]
                    rounded-2xl
                    p-5
                    hover:border-[#D8A85F]
                    transition
                  "
                >
                  <p className="text-xs uppercase tracking-wider font-semibold text-[#7A8581]">
                    Role
                  </p>

                  <p className="text-[#004643] font-semibold mt-2 capitalize">
                    {profile.role || "-"}
                  </p>
                </div>

              </div>
            </section>
          )}

          {/* ================= MEMBER MEMBERSHIP ================= */}

          {profile?.role === "member" && memberData && (
            <section
              className="
                bg-white
                rounded-3xl
                border border-[#DEDCD2]
                p-5 sm:p-7
                mb-6
                shadow-[0_8px_25px_rgba(0,70,67,0.06)]
              "
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1.5 h-6 rounded-full bg-[#D8A85F]"></div>

                <h2 className="text-xl font-bold text-[#004643]">
                  My Membership
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Membership Type */}
                <div
                  className="
                    bg-[#004643]
                    rounded-2xl
                    p-5
                    shadow-md
                  "
                >
                  <p className="text-sm text-[#B8CECA]">
                    Membership Type
                  </p>

                  <p className="text-xl font-bold text-[#F0EDE5] capitalize mt-2">
                    {memberData.membership_type || "-"}
                  </p>
                </div>

                {/* Status */}
                <div
                  className="
                    bg-[#004643]
                    rounded-2xl
                    p-5
                    shadow-md
                  "
                >
                  <p className="text-sm text-[#B8CECA]">
                    Status
                  </p>

                  <p className="text-xl font-bold text-[#D8A85F] capitalize mt-2">
                    {memberData.status || "-"}
                  </p>
                </div>

                {/* Start Date */}
                <div
                  className="
                    bg-[#F0EDE5]
                    border border-[#E1DED3]
                    rounded-2xl
                    p-5
                    hover:border-[#D8A85F]
                    transition
                  "
                >
                  <p className="text-sm text-[#7A8581]">
                    Start Date
                  </p>

                  <p className="text-lg font-bold text-[#004643] mt-2">
                    {memberData.membership_start || "-"}
                  </p>
                </div>

                {/* End Date */}
                <div
                  className="
                    bg-[#F0EDE5]
                    border border-[#E1DED3]
                    rounded-2xl
                    p-5
                    hover:border-[#D8A85F]
                    transition
                  "
                >
                  <p className="text-sm text-[#7A8581]">
                    End Date
                  </p>

                  <p className="text-lg font-bold text-[#004643] mt-2">
                    {memberData.membership_end || "-"}
                  </p>
                </div>

              </div>
            </section>
          )}

          {/* ================= MEMBER DATA NOT FOUND ================= */}

          {profile?.role === "member" && !memberData && (
            <section
              className="
                bg-white
                border border-[#DEDCD2]
                rounded-3xl
                p-6
                mb-6
                shadow-[0_8px_25px_rgba(0,70,67,0.06)]
              "
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F0EDE5] flex items-center justify-center text-[#004643] font-bold">
                  !
                </div>

                <div>
                  <h2 className="text-lg font-bold text-[#004643]">
                    My Membership
                  </h2>

                  <p className="text-[#6D7975] mt-1">
                    Membership information not available yet.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* ================= ROLE BASED ACTIONS ================= */}

          <section
            className="
              bg-white
              rounded-3xl
              border border-[#DEDCD2]
              p-5 sm:p-7
              shadow-[0_8px_25px_rgba(0,70,67,0.06)]
            "
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1.5 h-6 rounded-full bg-[#D8A85F]"></div>

              <h2 className="text-xl font-bold text-[#004643]">
                Quick Actions
              </h2>
            </div>

            <div className="flex flex-wrap gap-3">

              {/* Admin + Manager */}
              {(profile?.role === "admin" ||
                profile?.role === "manager") && (
                <button
                  onClick={() => navigate("/members")}
                  className="
                    bg-[#004643]
                    text-[#F0EDE5]
                    px-5 py-3
                    rounded-xl
                    font-semibold
                    hover:bg-[#155955]
                    transition
                    shadow-md
                  "
                >
                  Manage Members
                </button>
              )}

              {/* Trainer + Member */}
              {(profile?.role === "trainer" ||
                profile?.role === "member") && (
                <button
                  onClick={() => navigate("/calendar")}
                  className="
                    bg-[#F0EDE5]
                    text-[#004643]
                    border border-[#004643]
                    px-5 py-3
                    rounded-xl
                    font-semibold
                    hover:bg-[#E4E0D5]
                    transition
                  "
                >
                  Calendar
                </button>
              )}

              {/* Member Only */}
              {profile?.role === "member" && (
                <button
                  onClick={() => navigate("/billing")}
                  className="
                    bg-[#F0EDE5]
                    text-[#004643]
                    border border-[#004643]
                    px-5 py-3
                    rounded-xl
                    font-semibold
                    hover:bg-[#E4E0D5]
                    transition
                  "
                >
                  Billing
                </button>
              )}

            </div>
          </section>

        </div>
      </main>
    </>
  );
};

export default Dashboard;