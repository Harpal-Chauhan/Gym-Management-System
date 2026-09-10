import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import { toast } from "react-toastify";

const Members = () => {
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchMembers = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("members")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("FETCH MEMBERS ERROR:", error);
        toast.error(`Fetch to load members: ${error.message}`);
        return;
      }

      setMembers(data || []);
    } catch (error) {
      console.error("MEMBERS REQUEST ERROR:", error);
      toast.error(`Request failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this member?",
    );

    if (!confirmDelete) return;

    try {
      const { error } = await supabase.from("members").delete().eq("id", id);

      if (error) {
        console.error("DELETE MEMBER ERROR:", error);
        toast.error(`Failed to delete member: ${error.message}`);
        return;
      }

      toast.success("Member deleted successfully!");
      fetchMembers();
    } catch (error) {
      console.error("DELETE MEMBER ERROR:", error);
      toast.error(`Delete failed: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const filteredMembers = members.filter((member) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      member.name?.toLowerCase().includes(searchText) ||
      member.email?.toLowerCase().includes(searchText) ||
      member.phone?.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "all" || member.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0EDE5] md:ml-64 flex items-center justify-center px-4">
        <div className="bg-white border border-[#DEDCD2] rounded-2xl px-6 py-5 shadow-sm">
          <p className="text-[#004643] font-medium">Loading members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0EDE5] md:ml-64 p-4 sm:p-6 lg:p-8 pt-20 md:pt-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#004643]">
              Members
            </h1>

            <p className="text-sm sm:text-base text-gray-500 mt-1">
              Manage GymFlow members
            </p>
          </div>

          <button
            onClick={() => navigate("/add-member")}
            className="w-full sm:w-auto bg-[#004643] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#155955] transition"
          >
            + Add Member
          </button>
        </div>

        {/* FILTER BAR */}
        <div className="bg-white border border-[#DEDCD2] rounded-2xl shadow-sm p-4 mb-5">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-3 border border-[#DEDCD2] rounded-xl bg-[#FAF9F6] text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#155955] focus:ring-2 focus:ring-[#155955]/10 transition"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-48 px-4 py-3 border border-[#DEDCD2] rounded-xl bg-[#FAF9F6] text-gray-800 outline-none focus:border-[#155955] focus:ring-2 focus:ring-[#155955]/10 transition"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>

        {/* MEMBERS TABLE */}
        <div className="bg-white border border-[#DEDCD2] rounded-2xl shadow-sm overflow-hidden">
          {members.length === 0 ? (
            <div className="p-10 sm:p-14 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#F0EDE5] flex items-center justify-center">
                <span className="text-[#D8A85F] text-2xl font-bold">+</span>
              </div>

              <h3 className="text-lg font-semibold text-[#004643]">
                No members found
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Add your first member to GymFlow.
              </p>

              <button
                onClick={() => navigate("/add-member")}
                className="mt-5 bg-[#004643] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-[#155955] transition"
              >
                Add First Member
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px]">
                <thead className="bg-[#004643]">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-white">
                      Name
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-white">
                      Email
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-white">
                      Phone
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-white">
                      Membership
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-white">
                      Status
                    </th>

                    <th className="text-left px-6 py-4 text-sm font-semibold text-white">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <p className="text-[#004643] font-semibold">
                          No matching members
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                          Try changing your search or status filter.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map((member) => (
                      <tr
                        key={member.id}
                        className="border-t border-[#DEDCD2] hover:bg-[#FAF9F6] transition"
                      >
                        {/* NAME */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#F0EDE5] flex items-center justify-center text-[#004643] font-bold">
                              {member.name?.charAt(0)?.toUpperCase() || "M"}
                            </div>

                            <span className="font-semibold text-[#004643]">
                              {member.name}
                            </span>
                          </div>
                        </td>

                        {/* EMAIL */}
                        <td className="px-6 py-4 text-gray-600">
                          {member.email}
                        </td>

                        {/* PHONE */}
                        <td className="px-6 py-4 text-gray-600">
                          {member.phone || "-"}
                        </td>

                        {/* MEMBERSHIP */}
                        <td className="px-6 py-4">
                          <span className="capitalize text-gray-700">
                            {member.membership_type || "-"}
                          </span>
                        </td>

                        {/* STATUS */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                              member.status === "active"
                                ? "bg-[#E4F1EC] text-[#155955]"
                                : member.status === "expired"
                                  ? "bg-[#F5E5E2] text-[#9B4A40]"
                                  : "bg-[#F0EDE5] text-gray-600"
                            }`}
                          >
                            {member.status}
                          </span>
                        </td>

                        {/* ACTIONS */}
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                navigate(`/members/edit/${member.id}`)
                              }
                              className="px-3.5 py-2 bg-[#F0EDE5] text-[#004643] rounded-lg font-semibold hover:bg-[#DEDCD2] transition"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleDelete(member.id)}
                              className="px-3.5 py-2 bg-[#F5E5E2] text-[#9B4A40] rounded-lg font-semibold hover:bg-[#EDD8D4] transition"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 px-5 py-2.5 bg-white border border-[#DEDCD2] text-[#004643] rounded-xl font-semibold hover:bg-[#F0EDE5] transition"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Members;
