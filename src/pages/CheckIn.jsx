import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { toast } from "react-toastify";

const CheckIn = () => {
  const [members, setMembers] = useState([]);
  const [checkIns, setCheckIns] = useState([]);
  const [selectedMember, setSelectedMember] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: memberData, error: memberError } = await supabase
        .from("members")
        .select("id, name, email")
        .order("name", { ascending: true });

      if (memberError) {
        console.error("MEMBER ERROR FETCH:", memberError);
        toast.error(`Member fetch failed: ${memberError.message}`);
        return;
      }

      setMembers(memberData || []);

      const today = new Date().toISOString().split("T")[0];

      const { data: checkInData, error: checkInError } = await supabase
        .from("check_ins")
        .select(
          `
            id,
            member_id,
            check_in_date,
            check_in_time,
            check_out_time,
            members (
              name,
              email
            )
          `,
        )
        .eq("check_in_date", today)
        .order("check_in_time", { ascending: false });

      if (checkInError) {
        console.error("CHECK-IN FETCH ERROR:", checkInError);
        toast.error(`Check-in fetch failed: ${checkInError.message}`);
        return;
      }

      setCheckIns(checkInData || []);
    } catch (error) {
      console.error("CHECK-IN FETCH ERROR:", error);
      toast.error(`Something went wrong: ${error.message}`);
    }
  };

  const handleCheckIn = async () => {
    if (!selectedMember) {
      toast.error("Please select a member");
      return;
    }

    setLoading(true);

    try {
      const today = new Date().toISOString().split("T")[0];

      const { error } = await supabase.from("check_ins").insert({
        member_id: selectedMember,
        check_in_date: today,
      });

      if (error) {
        console.error("CHECK-IN ERROR:", error);
        toast.error(`Check-in failed: ${error.message}`);
        return;
      }

      toast.success("Member checked in successfully");

      setSelectedMember("");

      await fetchData();
    } catch (error) {
      console.error("CHECK-IN ERROR:", error);
      toast.error(`Something went wrong: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async (checkInId) => {
    setLoading(true);

    try {
      const { error } = await supabase
        .from("check_ins")
        .update({
          check_out_time: new Date().toISOString(),
        })
        .eq("id", checkInId);

      if (error) {
        console.error("CHECK-OUT ERROR:", error);
        toast.error(`Check-out failed: ${error.message}`);
        return;
      }

      toast.success("Member checked out successfully");

      await fetchData();
    } catch (error) {
      console.error("CHECK-OUT ERROR:", error);
      toast.error(`Something went wrong: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0EDE5] md:ml-64 p-4 sm:p-6 lg:p-8 pt-20 md:pt-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <p className="text-sm font-medium text-[#155955] mb-1">GymFlow</p>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#004643]">
            Check-in
          </h1>

          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Record today's member check-ins.
          </p>
        </div>

        {/* Check-in Card */}
        <div className="bg-white border border-[#DEDCD2] rounded-3xl p-5 sm:p-6 lg:p-7 mb-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-2xl bg-[#F0EDE5] flex items-center justify-center text-[#D8A85F] text-xl">
              ✓
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#004643]">
                Member Check-in
              </h2>

              <p className="text-sm text-gray-500">
                Select a member and record their attendance.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            {/* Member Select */}
            <div className="flex-1">
              <label className="block text-sm font-semibold text-[#004643] mb-2">
                Select Member
              </label>

              <select
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
                className="w-full bg-[#F7F5F0] border border-[#DEDCD2] rounded-xl px-4 py-3 text-sm sm:text-base text-gray-700 outline-none focus:border-[#004643] focus:ring-2 focus:ring-[#004643]/10 transition"
              >
                <option value="">Select Member</option>

                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} - {member.email}
                  </option>
                ))}
              </select>
            </div>

            {/* Check-in Button */}
            <div className="md:flex md:items-end">
              <button
                onClick={handleCheckIn}
                disabled={loading}
                className="w-full md:w-auto bg-[#004643] hover:bg-[#155955] text-white px-6 py-3 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Checking in..." : "Check In"}
              </button>
            </div>
          </div>
        </div>

        {/* Today's Check-ins */}
        <div className="bg-white border border-[#DEDCD2] rounded-3xl shadow-sm overflow-hidden">
          {/* Section Header */}
          <div className="p-5 sm:p-6 border-b border-[#DEDCD2]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[#004643]">
                  Today's Check-ins
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Members who checked in today.
                </p>
              </div>

              <div className="self-start sm:self-auto bg-[#F0EDE5] text-[#004643] px-4 py-2 rounded-full text-sm font-semibold">
                {checkIns.length} Check-in
                {checkIns.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>

          {/* Empty State */}
          {checkIns.length === 0 ? (
            <div className="p-8 sm:p-10 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#F0EDE5] flex items-center justify-center text-[#D8A85F] text-2xl">
                ✓
              </div>

              <p className="text-[#004643] font-semibold">
                No check-ins today.
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Today's member check-ins will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                {/* Table Header */}
                <thead>
                  <tr className="bg-[#004643] text-white text-left">
                    <th className="py-4 px-5 text-sm font-semibold">Member</th>

                    <th className="py-4 px-5 text-sm font-semibold">Email</th>

                    <th className="py-4 px-5 text-sm font-semibold whitespace-nowrap">
                      Check-in Time
                    </th>

                    <th className="py-4 px-5 text-sm font-semibold whitespace-nowrap">
                      Check-out Time
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                  {checkIns.map((checkIn) => (
                    <tr
                      key={checkIn.id}
                      className="border-b border-[#DEDCD2] last:border-b-0 hover:bg-[#F7F5F0] transition"
                    >
                      {/* Member */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#F0EDE5] text-[#004643] flex items-center justify-center font-bold shrink-0">
                            {checkIn.members?.name?.charAt(0)?.toUpperCase() ||
                              "?"}
                          </div>

                          <span className="font-semibold text-[#004643]">
                            {checkIn.members?.name || "Unknown"}
                          </span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-4 px-5 text-sm text-gray-600">
                        {checkIn.members?.email || "-"}
                      </td>

                      {/* Check-in Time */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#F0EDE5] text-[#155955] text-sm font-semibold">
                          {new Date(checkIn.check_in_time).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </span>
                      </td>

                      {/* Check-out Time */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        {checkIn.check_out_time ? (
                          <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#F0EDE5] text-[#155955] text-sm font-semibold">
                            {new Date(
                              checkIn.check_out_time,
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        ) : (
                          <button
                            onClick={() => handleCheckOut(checkIn.id)}
                            disabled={loading}
                            className="px-4 py-1.5 rounded-xl bg-[#D8A85F] text-[#004643] font-semibold text-sm hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Check Out
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckIn;
