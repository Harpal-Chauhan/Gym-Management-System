import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { toast } from "react-toastify";

const InviteList = () => {
  const navigate = useNavigate();

  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInvites = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("invites")
        .select("id, email, role, status, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("FETCH INVITES ERROR:", error);
        toast.error(`Failed to load invites: ${error.message}`);
        return;
      }

      setInvites(data || []);
    } catch (error) {
      console.error("INVITE LIST ERROR:", error);
      toast.error(`Request failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  const handleCancel = async (id) => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("invites")
        .update({ status: "cancelled" })
        .eq("id", id)
        .select();

      if (error) {
        console.error("CANCEL INVITE ERROR:", error);
        toast.error(`Cancel failed: ${error.message}`);
        return;
      }

      if (!data || data.length === 0) {
        toast.error("Invite was not updated");
        return;
      }

      toast.success("Invite cancelled successfully!");

      await fetchInvites();
    } catch (error) {
      console.error("CANCEL REQUEST ERROR:", error);
      toast.error(`Request failed: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0EDE5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#D8D2BF] border-t-[#004643] rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-[#004643] font-medium">
            Loading invites...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0EDE5] md:ml-64 p-4 sm:p-6 lg:p-8 pt-20 md:pt-8">

      <div className="max-w-6xl mx-auto">

        {/* ================= HEADER ================= */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

          <div>
            <p className="text-sm font-medium text-[#7A8581] mb-1">
              User Management
            </p>

            <h1 className="text-3xl sm:text-4xl font-bold text-[#004643]">
              User Invites
            </h1>

            <p className="text-[#687572] mt-2">
              Manage and track your user invitations.
            </p>
          </div>

          <button
            onClick={() => navigate("/invite-user")}
            className="
              w-full sm:w-auto
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
            + Invite User
          </button>

        </div>

        {/* ================= INVITE CARD ================= */}

        <div
          className="
            bg-white
            rounded-3xl
            border border-[#DEDCD2]
            shadow-[0_8px_25px_rgba(0,70,67,0.07)]
            overflow-hidden
          "
        >

          {/* Card Header */}

          <div
            className="
              px-5 sm:px-7
              py-5
              border-b border-[#DEDCD2]
              bg-[#F8F6F0]
            "
          >
            <div className="flex items-center gap-3">

              <div className="w-1.5 h-6 rounded-full bg-[#D8A85F]"></div>

              <div>
                <h2 className="text-lg font-bold text-[#004643]">
                  Invitation List
                </h2>

                <p className="text-sm text-[#7A8581] mt-0.5">
                  {invites.length} invitation
                  {invites.length !== 1 ? "s" : ""}
                </p>
              </div>

            </div>
          </div>

          {/* ================= EMPTY STATE ================= */}

          {invites.length === 0 ? (
            <div className="p-10 sm:p-14 text-center">

              <div
                className="
                  w-16 h-16
                  rounded-2xl
                  bg-[#F0EDE5]
                  text-[#004643]
                  flex items-center justify-center
                  mx-auto mb-4
                  text-2xl
                  font-bold
                "
              >
                @
              </div>

              <h3 className="text-lg font-bold text-[#004643]">
                No invites found
              </h3>

              <p className="text-[#7A8581] mt-2">
                Create an invitation to add a new user.
              </p>

              <button
                onClick={() => navigate("/invite-user")}
                className="
                  mt-5
                  bg-[#004643]
                  text-[#F0EDE5]
                  px-5 py-2.5
                  rounded-xl
                  font-semibold
                  hover:bg-[#155955]
                  transition
                "
              >
                + Invite User
              </button>

            </div>
          ) : (

            /* ================= TABLE ================= */

            <div className="overflow-x-auto">

              <table className="w-full min-w-[700px]">

                <thead className="bg-[#004643]">

                  <tr>

                    <th
                      className="
                        text-left
                        px-6 py-4
                        text-sm
                        font-semibold
                        text-[#F0EDE5]
                      "
                    >
                      Email
                    </th>

                    <th
                      className="
                        text-left
                        px-6 py-4
                        text-sm
                        font-semibold
                        text-[#F0EDE5]
                      "
                    >
                      Role
                    </th>

                    <th
                      className="
                        text-left
                        px-6 py-4
                        text-sm
                        font-semibold
                        text-[#F0EDE5]
                      "
                    >
                      Status
                    </th>

                    <th
                      className="
                        text-left
                        px-6 py-4
                        text-sm
                        font-semibold
                        text-[#F0EDE5]
                      "
                    >
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {invites.map((invite) => (

                    <tr
                      key={invite.id}
                      className="
                        border-t border-[#E6E3DA]
                        hover:bg-[#F8F6F0]
                        transition
                      "
                    >

                      {/* Email */}

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div
                            className="
                              w-9 h-9
                              rounded-lg
                              bg-[#F0EDE5]
                              text-[#004643]
                              flex items-center justify-center
                              font-bold
                              shrink-0
                            "
                          >
                            @
                          </div>

                          <span className="text-[#004643] font-medium">
                            {invite.email}
                          </span>

                        </div>

                      </td>

                      {/* Role */}

                      <td className="px-6 py-5">

                        <span
                          className="
                            inline-flex
                            px-3 py-1.5
                            rounded-full
                            bg-[#E7F0EE]
                            text-[#004643]
                            text-sm
                            font-semibold
                            capitalize
                          "
                        >
                          {invite.role}
                        </span>

                      </td>

                      {/* Status */}

                      <td className="px-6 py-5">

                        {invite.status === "pending" && (
                          <span
                            className="
                              inline-flex
                              px-3 py-1.5
                              rounded-full
                              bg-[#FFF4D9]
                              text-[#8A651C]
                              text-sm
                              font-semibold
                              capitalize
                            "
                          >
                            {invite.status}
                          </span>
                        )}

                        {invite.status === "accepted" && (
                          <span
                            className="
                              inline-flex
                              px-3 py-1.5
                              rounded-full
                              bg-[#E4F1EA]
                              text-[#24613F]
                              text-sm
                              font-semibold
                              capitalize
                            "
                          >
                            {invite.status}
                          </span>
                        )}

                        {invite.status === "cancelled" && (
                          <span
                            className="
                              inline-flex
                              px-3 py-1.5
                              rounded-full
                              bg-[#F3E6E2]
                              text-[#8A463A]
                              text-sm
                              font-semibold
                              capitalize
                            "
                          >
                            {invite.status}
                          </span>
                        )}

                      </td>

                      {/* Action */}

                      <td className="px-6 py-5">

                        {invite.status === "pending" && (
                          <button
                            onClick={() =>
                              handleCancel(invite.id)
                            }
                            className="
                              px-4 py-2
                              rounded-lg
                              border border-[#D7B4AC]
                              text-[#8A463A]
                              font-semibold
                              text-sm
                              hover:bg-[#F3E6E2]
                              transition
                            "
                          >
                            Cancel
                          </button>
                        )}

                        {invite.status !== "pending" && (
                          <span className="text-[#9A9F9C] text-sm">
                            No action
                          </span>
                        )}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

        {/* ================= BACK BUTTON ================= */}

        <button
          onClick={() => navigate("/dashboard")}
          className="
            mt-6
            px-5 py-3
            rounded-xl
            bg-white
            border border-[#DEDCD2]
            text-[#004643]
            font-semibold
            hover:bg-[#E8E5DB]
            transition
            shadow-sm
          "
        >
          ← Back to Dashboard
        </button>

      </div>

    </div>
  );
};

export default InviteList;