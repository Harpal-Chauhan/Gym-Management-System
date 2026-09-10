import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { supabase } from "../lib/supabaseClient";

const Analytics = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    inactiveMembers: 0,
    expiredMembers: 0,
    totalPayments: 0,
    totalRevenue: 0,
    totalCheckIns: 0,
    todayCheckIns: 0,
  });

  const [recentPayments, setRecentPayments] = useState([]);
  const [recentCheckIns, setRecentCheckIns] = useState([]);
  const [members, setMembers] = useState([]);

  const [selectedMemberType, setSelectedMemberType] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // ================= MEMBERS =================

      const { data: membersData, error: membersError } = await supabase
        .from("members")
        .select(
          "id, name, email, phone, membership_type, membership_start, membership_end, status",
        )
        .order("created_at", { ascending: false });

      if (membersError) throw membersError;

      // ================= PAYMENTS =================

      const { data: payments, error: paymentsError } = await supabase
        .from("payments")
        .select(
          `
          id,
          amount,
          payment_date,
          status,
          products (
            name
          ),
          members (
            name
          )
        `,
        )
        .order("payment_date", { ascending: false });

      if (paymentsError) throw paymentsError;

      // ================= CHECK-INS =================

      const { data: checkIns, error: checkInsError } = await supabase
        .from("check_ins")
        .select(
          `
          id,
          check_in_date,
          check_in_time,
          members (
            name
          )
        `,
        )
        .order("check_in_time", { ascending: false });

      if (checkInsError) throw checkInsError;

      // ================= MEMBER STATS =================

      const totalMembers = membersData?.length || 0;

      const activeMembers =
        membersData?.filter((member) => member.status === "active").length || 0;

      const inactiveMembers =
        membersData?.filter((member) => member.status === "inactive").length ||
        0;

      const expiredMembers =
        membersData?.filter((member) => member.status === "expired").length ||
        0;

      // ================= PAYMENT STATS =================

      const totalPayments = payments?.length || 0;

      const totalRevenue =
        payments
          ?.filter((payment) => payment.status === "paid")
          .reduce((total, payment) => total + Number(payment.amount || 0), 0) ||
        0;

      // ================= CHECK-IN STATS =================

      const today = new Date().toISOString().split("T")[0];

      const totalCheckIns = checkIns?.length || 0;

      const todayCheckIns =
        checkIns?.filter((checkIn) => checkIn.check_in_date === today).length ||
        0;

      // ================= SET DATA =================

      setStats({
        totalMembers,
        activeMembers,
        inactiveMembers,
        expiredMembers,
        totalPayments,
        totalRevenue,
        totalCheckIns,
        todayCheckIns,
      });

      setMembers(membersData || []);
      setRecentPayments(payments?.slice(0, 5) || []);
      setRecentCheckIns(checkIns?.slice(0, 5) || []);
    } catch (error) {
      console.error("ANALYTICS ERROR:", error);

      toast.error(`Failed to load analytics: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // ================= MEMBER CARD CLICK =================

  const handleMemberCardClick = (type) => {
    setSelectedMemberType(type);
  };

  const getSelectedMembers = () => {
    if (selectedMemberType === "total") {
      return members;
    }

    return members.filter((member) => member.status === selectedMemberType);
  };

  const selectedMembers = getSelectedMembers();

  // ================= LOADING =================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F0EDE5] md:ml-64 pt-20 md:pt-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#D8D2BF] border-t-[#004643] rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-[#004643] font-medium">Loading analytics...</p>
        </div>
      </main>
    );
  }

  // ================= CARDS =================

  const memberCards = [
    {
      title: "Total Members",
      value: stats.totalMembers,
      type: "total",
    },
    {
      title: "Active Members",
      value: stats.activeMembers,
      type: "active",
    },
    {
      title: "Inactive Members",
      value: stats.inactiveMembers,
      type: "inactive",
    },
    {
      title: "Expired Members",
      value: stats.expiredMembers,
      type: "expired",
    },
  ];

  const activityCards = [
    {
      title: "Total Payments",
      value: stats.totalPayments,
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toFixed(2)}`,
    },
    {
      title: "Total Check-ins",
      value: stats.totalCheckIns,
    },
    {
      title: "Today's Check-ins",
      value: stats.todayCheckIns,
    },
  ];

  return (
    <main className="min-h-screen bg-[#F0EDE5] md:ml-64 p-4 sm:p-6 lg:p-8 pt-20 md:pt-8">
      <div className="max-w-7xl mx-auto">
        {/* ================= HEADER ================= */}

        <div className="mb-8">
          <p className="text-sm font-semibold text-[#D8A85F] mb-2">ADMIN</p>

          <h1 className="text-3xl sm:text-4xl font-bold text-[#004643]">
            Analytics
          </h1>

          <p className="text-[#687572] mt-2">
            Overview of gym activity and performance.
          </p>
        </div>

        {/* ================= MEMBER OVERVIEW ================= */}

        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-6 rounded-full bg-[#D8A85F]"></div>

            <h2 className="text-xl font-bold text-[#004643]">
              Member Overview
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {memberCards.map((card) => (
              <button
                key={card.title}
                onClick={() => handleMemberCardClick(card.type)}
                className="text-left bg-white border border-[#DEDCD2] rounded-3xl p-6 shadow-[0_8px_25px_rgba(0,70,67,0.06)] hover:border-[#D8A85F] hover:shadow-[0_10px_30px_rgba(0,70,67,0.10)] transition"
              >
                <p className="text-sm font-medium text-[#7A8581]">
                  {card.title}
                </p>

                <h3 className="text-3xl font-bold text-[#004643] mt-3">
                  {card.value}
                </h3>

                <p className="text-xs text-[#D8A85F] font-semibold mt-3">
                  Click to view members →
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* ================= MEMBER DETAILS ================= */}

        {selectedMemberType && (
          <section className="bg-white border border-[#DEDCD2] rounded-3xl overflow-hidden mb-8">
            {/* Header */}

            <div className="p-5 sm:p-6 border-b border-[#DEDCD2] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-[#004643]">
                  {selectedMemberType === "total"
                    ? "All Members"
                    : `${selectedMemberType
                        .charAt(0)
                        .toUpperCase()}${selectedMemberType.slice(1)} Members`}
                </h2>

                <p className="text-sm text-[#687572] mt-1">
                  {selectedMembers.length} member
                  {selectedMembers.length !== 1 ? "s" : ""} found
                </p>
              </div>

              <button
                onClick={() => setSelectedMemberType(null)}
                className="self-start sm:self-auto px-4 py-2 rounded-xl border border-[#004643] text-[#004643] font-semibold hover:bg-[#F0EDE5] transition"
              >
                Close
              </button>
            </div>

            {/* Members */}

            {selectedMembers.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-[#687572]">No members found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead className="bg-[#004643] text-white">
                    <tr>
                      <th className="text-left px-5 py-4 text-sm">Name</th>

                      <th className="text-left px-5 py-4 text-sm">Email</th>

                      <th className="text-left px-5 py-4 text-sm">Phone</th>

                      <th className="text-left px-5 py-4 text-sm">
                        Membership
                      </th>

                      <th className="text-left px-5 py-4 text-sm">
                        Start Date
                      </th>

                      <th className="text-left px-5 py-4 text-sm">End Date</th>

                      <th className="text-left px-5 py-4 text-sm">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {selectedMembers.map((member) => (
                      <tr
                        key={member.id}
                        className="border-b border-[#DEDCD2] last:border-0"
                      >
                        <td className="px-5 py-4 text-sm font-semibold text-[#004643]">
                          {member.name || "-"}
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600">
                          {member.email || "-"}
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600">
                          {member.phone || "-"}
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600 capitalize">
                          {member.membership_type || "-"}
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600">
                          {member.membership_start || "-"}
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600">
                          {member.membership_end || "-"}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                              member.status === "active"
                                ? "bg-green-100 text-green-700"
                                : member.status === "inactive"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {member.status || "-"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* ================= ACTIVITY OVERVIEW ================= */}

        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-6 rounded-full bg-[#D8A85F]"></div>

            <h2 className="text-xl font-bold text-[#004643]">
              Activity Overview
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {activityCards.map((card) => (
              <div
                key={card.title}
                className="bg-white border border-[#DEDCD2] rounded-3xl p-6 shadow-[0_8px_25px_rgba(0,70,67,0.06)]"
              >
                <p className="text-sm font-medium text-[#7A8581]">
                  {card.title}
                </p>

                <h3 className="text-3xl font-bold text-[#004643] mt-3">
                  {card.value}
                </h3>
              </div>
            ))}
          </div>
        </section>

        {/* ================= RECENT ACTIVITY ================= */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Recent Payments */}

          <section className="bg-white border border-[#DEDCD2] rounded-3xl overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-[#DEDCD2]">
              <h2 className="text-xl font-bold text-[#004643]">
                Recent Payments
              </h2>

              <p className="text-sm text-[#687572] mt-1">
                Latest payment activity
              </p>
            </div>

            {recentPayments.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No payments found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[550px]">
                  <thead className="bg-[#004643] text-white">
                    <tr>
                      <th className="text-left px-5 py-3 text-sm">Member</th>

                      <th className="text-left px-5 py-3 text-sm">Product</th>

                      <th className="text-left px-5 py-3 text-sm">Amount</th>

                      <th className="text-left px-5 py-3 text-sm">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentPayments.map((payment) => (
                      <tr
                        key={payment.id}
                        className="border-b border-[#DEDCD2] last:border-0"
                      >
                        <td className="px-5 py-4 text-sm font-medium text-[#004643]">
                          {payment.members?.name || "-"}
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600">
                          {payment.products?.name || "-"}
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold text-gray-800">
                          ₹{Number(payment.amount).toFixed(2)}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              payment.status === "paid"
                                ? "bg-green-100 text-green-700"
                                : payment.status === "pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Recent Check-ins */}

          <section className="bg-white border border-[#DEDCD2] rounded-3xl overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-[#DEDCD2]">
              <h2 className="text-xl font-bold text-[#004643]">
                Recent Check-ins
              </h2>

              <p className="text-sm text-[#687572] mt-1">
                Latest member check-ins
              </p>
            </div>

            {recentCheckIns.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No check-ins found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[450px]">
                  <thead className="bg-[#004643] text-white">
                    <tr>
                      <th className="text-left px-5 py-3 text-sm">Member</th>

                      <th className="text-left px-5 py-3 text-sm">Date</th>

                      <th className="text-left px-5 py-3 text-sm">Time</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentCheckIns.map((checkIn) => (
                      <tr
                        key={checkIn.id}
                        className="border-b border-[#DEDCD2] last:border-0"
                      >
                        <td className="px-5 py-4 text-sm font-medium text-[#004643]">
                          {checkIn.members?.name || "-"}
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600">
                          {checkIn.check_in_date}
                        </td>

                        <td className="px-5 py-4 text-sm text-gray-600">
                          {new Date(checkIn.check_in_time).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default Analytics;
