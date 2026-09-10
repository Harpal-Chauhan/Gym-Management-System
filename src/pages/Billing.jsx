import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { toast } from "react-toastify";

const Billing = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBilling = async () => {
    try {
      setLoading(true);

      // GET LOGGED-IN USER
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        toast.error("Please login first");
        return;
      }

      //   FIND MEMBER RECORD
      const { data: member, error: memberError } = await supabase
        .from("members")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (memberError) {
        throw memberError;
      }

      if (!member) {
        toast.error("Member profile not found");
        return;
      }

      // FETCH ONLY THIS MEMBER'S PAYMENTS
      const { data, error } = await supabase
        .from("payments")
        .select(
          `
        id,
        amount,
        payment_date,
        status,
        products (
            name
        )
        `,
        )
        .eq("member_id", member.id)
        .order("payment_date", { ascending: false });

      if (error) {
        throw error;
      }

      setPayments(data || []);
    } catch (error) {
      console.error("BILLING ERROR:", error);
      toast.error(`Failed to load billing: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBilling();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0EDE5] md:ml-64 pt-20 md:pt-8 p-6 flex items-center justify-center">
        <p className="text-[#004643] font-medium">Loading billing...</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#F0EDE5] md:ml-64 p-4 sm:p-6 lg:p-8 pt-20 md:pt-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <p className="text-sm font-medium text-[#D8A85F]">ACCOUNT</p>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#004643]">
            Billing
          </h1>

          <p className="text-sm sm:text-base text-gray-600 mt-1">
            View your payment history
          </p>
        </div>

        {/* Billing Card */}
        <div className="bg-white border border-[#DEDCD2] rounded-3xl overflow-hidden">
          {payments.length === 0 ? (
            <div className="p-10 text-center">
              <div className="text-4xl mb-3">🧾</div>

              <h2 className="text-lg font-semibold text-[#004643]">
                No payments found
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Your payment history will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px]">
                <thead className="bg-[#004643] text-white">
                  <tr>
                    <th className="text-left px-5 py-4 text-sm font-semibold">
                      Product
                    </th>

                    <th className="text-left px-5 py-4 text-sm font-semibold">
                      Amount
                    </th>

                    <th className="text-left px-5 py-4 text-sm font-semibold">
                      Payment Date
                    </th>

                    <th className="text-left px-5 py-4 text-sm font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} className="border-t border-[#DEDCD2]">
                      <td className="px-5 py-4 text-sm font-medium text-[#004643]">
                        {payment.products?.name || "Product"}
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-gray-800">
                        ₹{Number(payment.amount).toFixed(2)}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-600">
                        {payment.payment_date}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
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
        </div>
      </div>
    </div>
  );
};

export default Billing;
