import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { supabase } from "../lib/supabaseClient";

const RoleRoute = ({ children, allowedRoles = [] }) => {
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const checkRole = async () => {
      try {
        // 1. Get logged-in user
        const { data: userData, error: userError } =
          await supabase.auth.getUser();

        if (userError) {
          console.error("GET USER ERROR:", userError);
          toast.error(`User fetch error: ${userError.message}`);
          return;
        }

        if (!userData?.user) {
          return;
        }

        // 2. Get profile
        const { data: profileData, error: profileError } =
          await supabase
            .from("profiles")
            .select("name, email, role")
            .eq("user_id", userData.user.id)
            .maybeSingle();

        if (profileError) {
          console.error("PROFILE FETCH ERROR:", profileError);
          toast.error(`Profile fetch error: ${profileError.message}`);
          return;
        }

        if (!profileData) {
          console.error(
            "PROFILE NOT FOUND FOR USER:",
            userData.user.id
          );

          toast.error("Your profile was not found");
          return;
        }

        // 3. Save role
        setRole(profileData.role);
      } catch (error) {
        console.error("ROLE CHECK ERROR:", error);
        toast.error(`Role check failed: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    checkRole();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Checking access...</p>
      </div>
    );
  }

  if (!role) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!allowedRoles.includes(role)) {
    toast.error("You don't have permission to access this page");

    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RoleRoute;