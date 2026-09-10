import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { supabase } from "../lib/supabaseClient";

const Navbar = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Load logged-in user and profile
  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data: userData, error: userError } =
          await supabase.auth.getUser();

        if (userError) {
          console.error("NAVBAR USER ERROR:", userError);
          return;
        }

        if (!userData?.user) {
          return;
        }

        setUser(userData.user);

        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("name, email, role")
          .eq("user_id", userData.user.id)
          .maybeSingle();

        if (profileError) {
          console.error("NAVBAR PROFILE ERROR:", profileError);
          return;
        }

        setProfile(profileData);
      } catch (error) {
        console.error("NAVBAR ERROR:", error);
      }
    };

    loadUser();
  }, []);

  // Logout
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("LOGOUT ERROR:", error);
        toast.error(`Logout failed: ${error.message}`);
        return;
      }

      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
      toast.error(`Logout failed: ${error.message}`);
    }
  };

  const role = profile?.role;

  // Role based menu
  const menuItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      roles: ["admin", "manager", "trainer", "member"],
    },
    {
      label: "Members",
      path: "/members",
      roles: ["admin", "manager"],
    },
    {
      label: "Invite User",
      path: "/invite-user",
      roles: ["admin"],
    },
    {
      label: "Invite List",
      path: "/invite-list",
      roles: ["admin"],
    },
    {
      label: "Signup Form",
      path: "/signup-form",
      roles: ["member"],
    },
    {
      label: "Products",
      path: "/products",
      roles: ["admin", "manager"],
    },
    {
      label: "Payments",
      path: "/payments",
      roles: ["admin", "manager"],
    },
    {
      label: "Check-in",
      path: "/check-in",
      roles: ["admin", "manager"],
    },
    {
      label: "Calendar",
      path: "/calendar",
      roles: ["admin", "manager", "trainer", "member"],
    },
    {
      label: "Settings",
      path: "/settings",
      roles: ["trainer", "member"],
    },
    {
      label: "Billing",
      path: "/billing",
      roles: ["member"],
    },
    {
      label: "Analytics",
      path: "/analytics",
      roles: ["admin"],
    },
  ];

  const visibleItems = menuItems.filter((item) => item.roles.includes(role));

  const closeMobileMenu = () => {
    setMobileOpen(false);
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

  return (
    <>
      {/* ================= MOBILE HEADER ================= */}
      <header
        className="
          md:hidden
          fixed top-0 left-0 right-0
          z-50
          h-16
          bg-[#004643]
          border-b border-[#155955]
          shadow-lg
          flex items-center justify-between
          px-4
        "
      >
        {/* Menu Button */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="
            w-10 h-10
            flex items-center justify-center
            rounded-xl
            text-[#F0EDE5]
            hover:bg-[#155955]
            transition
          "
          aria-label="Toggle menu"
        >
          <span className="text-2xl">{mobileOpen ? "✕" : "☰"}</span>
        </button>

        {/* Logo */}
        <h1 className="text-xl font-bold text-[#F0EDE5]">
          Gym<span className="text-[#D8A85F]">Flow</span>
        </h1>

        {/* Profile */}
        <div
          className="
            w-9 h-9
            rounded-full
            bg-[#F0EDE5]
            text-[#004643]
            flex items-center justify-center
            font-bold
            border-2 border-[#D8A85F]
          "
        >
          {getInitial()}
        </div>
      </header>

      {/* ================= MOBILE OVERLAY ================= */}
      {mobileOpen && (
        <div
          onClick={closeMobileMenu}
          className="
            md:hidden
            fixed inset-0
            z-40
            bg-[#004643]/60
            backdrop-blur-sm
          "
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        className={`
          fixed top-0 left-0
          z-50
          h-screen w-64
          bg-[#004643]
          border-r border-[#155955]
          flex flex-col
          shadow-2xl
          transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* ================= LOGO ================= */}
        <div
          className="
            h-16
            flex items-center
            px-5
            border-b border-[#155955]
          "
        >
          <div className="flex items-center gap-2.5">
            {/* Logo Circle */}
            <div
              className="
                w-9 h-9
                rounded-xl
                bg-[#F0EDE5]
                text-[#004643]
                flex items-center justify-center
                font-bold text-base
                shadow-md
                border border-[#D8A85F]
              "
            >
              G
            </div>

            {/* Brand */}
            <h1 className="text-xl font-bold text-[#F0EDE5]">
              Gym<span className="text-[#D8A85F]">Flow</span>
            </h1>
          </div>
        </div>

        {/* ================= NAVIGATION ================= */}
        <nav className="flex-1 p-3 overflow-y-auto">
          <p
            className="
              text-[10px]
              font-semibold
              text-[#8FB3AE]
              uppercase
              tracking-wider
              px-3
              mb-2
            "
          >
            Menu
          </p>

          <div className="space-y-0.5">
            {visibleItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `
                  flex items-center
                  px-3 py-2.5
                  rounded-xl
                  text-sm
                  font-medium
                  transition-all duration-200
                  ${
                    isActive
                      ? `
                        bg-[#F0EDE5]
                        text-[#004643]
                        shadow-md
                      `
                      : `
                        text-[#D4DDD9]
                        hover:bg-[#155955]
                        hover:text-[#F0EDE5]
                      `
                  }
                `
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* ================= LOGOUT ================= */}
        <div className="p-3 border-t border-[#155955]">
          {/* User Profile */}
          <div className="flex items-center gap-2.5 px-2 py-2 mb-2">
            <div
              className="
        w-9 h-9
        rounded-full
        bg-[#F0EDE5]
        text-[#004643]
        flex items-center justify-center
        font-bold text-sm
        border-2 border-[#D8A85F]
        shrink-0
      "
            >
              {getInitial()}
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#F0EDE5] truncate">
                {profile?.name || user?.email || "User"}
              </p>

              <p className="text-xs text-[#D8A85F] capitalize">
                {role || "user"}
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="
      w-full
      flex items-center
      px-3 py-2.5
      rounded-xl
      text-sm
      font-medium
      text-[#D4DDD9]
      hover:bg-[#5A403B]
      hover:text-[#F0EDE5]
      transition
    "
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
