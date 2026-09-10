import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { toast } from "react-toastify";

const Payment = () => {
  const [payments, setPayments] = useState([]);
  const [products, setproducts] = useState([]);
  const [members, setMembers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    member_id: "",
    product_id: "",
    amount: "",
    payment_date: new Date().toISOString().split("T")[0],
    status: "paid",
  });

  const fetchData = async () => {
    try {
      setLoading(true);

      const [paymentResults, membersResult, productsResult] = await Promise.all(
        [
          supabase
            .from("payments")
            .select(
              `
                *,
                members (
                  name,
                  email
                ),
                products (
                  name
                )
              `,
            )
            .order("created_at", { ascending: false }),

          supabase.from("members").select("id, name, email").order("name"),

          supabase.from("products").select("id, name, price").order("name"),
        ],
      );

      if (paymentResults.error) {
        throw paymentResults.error;
      }

      if (membersResult.error) {
        throw membersResult.error;
      }

      if (productsResult.error) {
        throw productsResult.error;
      }

      setPayments(paymentResults.data || []);
      setMembers(membersResult.data || []);
      setproducts(productsResult.data || []);
    } catch (error) {
      console.error("PAYMENT FETCH ERROR:", error);
      toast.error(`Failed to load payment data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // PRODUCT SELECT PRICE AUTOMATICALLY FILL
    if (name === "product_id") {
      const selectedProduct = products.find((product) => product.id === value);

      if (selectedProduct) {
        setFormData((prev) => ({
          ...prev,
          product_id: value,
          amount: selectedProduct.price,
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.member_id) {
      toast.error("Please select a member");
      return;
    }

    if (!formData.product_id) {
      toast.error("Please select a product");
      return;
    }

    if (formData.amount === "" || Number(formData.amount) < 0) {
      toast.error("Valid amount is required");
      return;
    }

    if (!formData.payment_date) {
      toast.error("Payment date is required");
      return;
    }

    try {
      const paymentData = {
        member_id: formData.member_id,
        product_id: formData.product_id,
        amount: Number(formData.amount),
        payment_date: formData.payment_date,
        status: formData.status,
      };

      if (editingId) {
        const { error } = await supabase
          .from("payments")
          .update(paymentData)
          .eq("id", editingId);

        if (error) {
          console.error("PAYMENT UPDATE ERROR:", error);
          toast.error(`Failed to update payment ${error.message}`);
          return;
        }

        toast.success("Payment updated successfully");
      } else {
        const { error } = await supabase.from("payments").insert([paymentData]);

        if (error) {
          console.error("PAYMENT INSERT ERROR:", error);
          toast.error(`Failed to payment error: ${error.message}`);
          return;
        }

        toast.success("Payment added successfully");
      }

      resetForm();
      fetchData();
    } catch (error) {
      console.error("PAYMENT SAVE ERROR:", error);
      toast.error(`Something went wrong: ${error.message}`);
    }
  };

  const handleEdit = (payment) => {
    setEditingId(payment.id);

    setFormData({
      member_id: payment.member_id || "",
      product_id: payment.product_id || "",
      amount: payment.amount ?? "",
      payment_date: payment.payment_date || "",
      status: payment.status || "paid",
    })
  }

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from("payments").delete().eq("id", id);

      if (error) {
        console.error("PAYMENT DELETE ERROR:", error);
        toast.error(`Failed to delete payment: ${error.message}`);
        return;
      }

      toast.success("Payment deleted successfully");

      if (editingId === id) {
        resetForm();
      }

      fetchData();
    } catch (error) {
      console.error("PAYMENT DELETE ERROR:", error);
      toast.error(`Something went wrong, ${error.message}`);
    }
  };

  const resetForm = () => {
    setEditingId(null);

    setFormData({
      member_id: "",
      product_id: "",
      amount: "",
      payment_date: new Date().toISOString().split("T")[0],
      status: "paid",
    });
  };

  return (
    <div className="min-h-screen bg-[#F0EDE5] md:ml-64 p-4 sm:p-6 lg:p-8 pt-20 md:pt-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#004643]">
            Payments
          </h1>

          <p className="text-sm sm:text-base text-gray-500 mt-1">
            Manage gym payments
          </p>
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-3xl border border-[#DEDCD2] shadow-sm p-5 sm:p-6 lg:p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#004643]">
                {editingId ? "Edit Payment" : "Add Payment"}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {editingId
                  ? "Update payment details"
                  : "Add a new payment record"}
              </p>
            </div>

            <div className="hidden sm:flex w-11 h-11 rounded-xl bg-[#F0EDE5] items-center justify-center text-[#D8A85F] font-bold">
              ₹
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Member + Product */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Member */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-[#004643]">
                  Member
                </label>

                <select
                  name="member_id"
                  value={formData.member_id}
                  onChange={handleChange}
                  className="w-full border border-[#DEDCD2] bg-[#FAF9F6] rounded-xl px-4 py-3 outline-none text-gray-700 focus:border-[#155955] focus:ring-2 focus:ring-[#155955]/10"
                >
                  <option value="">Select Member</option>

                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name} - {member.email}
                    </option>
                  ))}
                </select>
              </div>

              {/* Product */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-[#004643]">
                  Product
                </label>

                <select
                  name="product_id"
                  value={formData.product_id}
                  onChange={handleChange}
                  className="w-full border border-[#DEDCD2] bg-[#FAF9F6] rounded-xl px-4 py-3 outline-none text-gray-700 focus:border-[#155955] focus:ring-2 focus:ring-[#155955]/10"
                >
                  <option value="">Select Product</option>

                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} - ₹{product.price}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Amount + Date + Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Amount */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-[#004643]">
                  Amount
                </label>

                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="Enter amount"
                  className="w-full border border-[#DEDCD2] bg-[#FAF9F6] rounded-xl px-4 py-3 outline-none text-gray-700 focus:border-[#155955] focus:ring-2 focus:ring-[#155955]/10"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-[#004643]">
                  Payment Date
                </label>

                <input
                  type="date"
                  name="payment_date"
                  value={formData.payment_date}
                  onChange={handleChange}
                  className="w-full border border-[#DEDCD2] bg-[#FAF9F6] rounded-xl px-4 py-3 outline-none text-gray-700 focus:border-[#155955] focus:ring-2 focus:ring-[#155955]/10"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block mb-2 text-sm font-semibold text-[#004643]">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border border-[#DEDCD2] bg-[#FAF9F6] rounded-xl px-4 py-3 outline-none text-gray-700 focus:border-[#155955] focus:ring-2 focus:ring-[#155955]/10"
                >
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#004643] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#155955] transition"
              >
                {editingId ? "Update Payment" : "Add Payment"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full sm:w-auto border border-[#DEDCD2] bg-white text-[#004643] px-6 py-3 rounded-xl font-semibold hover:bg-[#F0EDE5] transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Payment List */}
        <div className="bg-white rounded-3xl border border-[#DEDCD2] shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-[#DEDCD2]">
            <h2 className="text-xl sm:text-2xl font-bold text-[#004643]">
              Payment List
            </h2>

            <p className="text-sm text-gray-500 mt-1">Recent payment records</p>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Loading payments...</p>
            </div>
          ) : payments.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No payments found.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#DEDCD2]">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 hover:bg-[#FAF9F6] transition"
                >
                  {/* Payment Info */}
                  <div className="min-w-0">
                    <h3 className="font-bold text-lg text-[#004643] truncate">
                      {payment.members?.name || "Unknown Member"}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {payment.members?.email || "No email"}
                    </p>

                    <p className="text-[#155955] font-medium mt-2">
                      {payment.products?.name || "Unknown Product"}
                    </p>

                    <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3 text-sm text-gray-500">
                      <span>
                        Amount:{" "}
                        <span className="font-semibold text-[#004643]">
                          ₹{Number(payment.amount).toFixed(2)}
                        </span>
                      </span>

                      <span>
                        Date:{" "}
                        <span className="font-medium text-gray-700">
                          {payment.payment_date}
                        </span>
                      </span>
                    </div>

                    {/* Status */}
                    <div className="mt-3">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                          payment.status === "paid"
                            ? "bg-green-100 text-green-700"
                            : payment.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2 lg:flex-shrink-0">
                    <button
                      onClick={() => handleEdit(payment)}
                      className="w-full sm:w-auto border border-[#155955] text-[#155955] px-5 py-2.5 rounded-xl font-semibold hover:bg-[#155955] hover:text-white transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(payment.id)}
                      className="w-full sm:w-auto bg-red-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
