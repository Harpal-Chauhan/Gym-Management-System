import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { toast } from "react-toastify";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
  });

  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("PRODUCT FETCH ERROR:", error);
        toast.error(`Failed to load products: ${error.message}`);
        return;
      }

      setProducts(data || []);
    } catch (error) {
      console.error("PRODUCT FETCH ERROR:", error);
      toast.error(`Something went wrong: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Product name is required");
      return;
    }

    if (formData.price === "" || Number(formData.price) < 0) {
      toast.error("Valid product price is required");
      return;
    }

    try {
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        price: Number(formData.price),
      };

      if (editingId) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingId);

        if (error) {
          console.error("PRODUCT UPDATE ERROR:", error);
          toast.error(`Failed to update product: ${error.message}`);
          return;
        }

        toast.success("Product updated successfully");
      } else {
        const { error } = await supabase.from("products").insert([productData]);

        if (error) {
          console.error("PRODUCT INSERT ERROR:", error);
          toast.error(`Failed to add product: ${error.message}`);
          return;
        }

        toast.success("Product added successfully");
      }

      setFormData({
        name: "",
        description: "",
        price: "",
      });

      setEditingId(null);
      fetchProducts();
    } catch (error) {
      console.error("PRODUCT SAVE ERROR:", error);
      toast.error(`Something went wrong: ${error.message}`);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);

    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
    });
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) {
        console.error("PRODUCT DELETE ERROR:", error);
        toast.error(`Failed to delete product: ${error.message}`);
        return;
      }

      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.error("PRODUCT DELETE ERROR:", error);
      toast.error(`Something went wrong: ${error.message}`);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);

    setFormData({
      name: "",
      description: "",
      price: "",
    });
  };

  return (
    <div className="min-h-screen bg-[#F0EDE5] md:ml-64 p-4 sm:p-6 lg:p-8 pt-20 md:pt-8">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#004643]">
            Products
          </h1>

          <p className="text-sm sm:text-base text-gray-500 mt-1">
            Manage gym products and pricing
          </p>
        </div>

        {/* Add / Edit Product */}
        <div className="bg-white border border-[#DEDCD2] rounded-3xl shadow-sm p-5 sm:p-6 lg:p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#004643]">
                {editingId ? "Edit Product" : "Add Product"}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                {editingId
                  ? "Update product information"
                  : "Create a new gym product"}
              </p>
            </div>

            <div className="hidden sm:flex w-11 h-11 rounded-xl bg-[#F0EDE5] items-center justify-center text-[#D8A85F] text-xl font-bold">
              ₹
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Product Name */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-[#004643]">
                Product Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter product name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-[#DEDCD2] bg-[#FAF9F6] rounded-xl px-4 py-3 outline-none text-gray-700 placeholder:text-gray-400 focus:border-[#155955] focus:ring-2 focus:ring-[#155955]/10 transition"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-[#004643]">
                Description
              </label>

              <textarea
                name="description"
                placeholder="Enter product description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full border border-[#DEDCD2] bg-[#FAF9F6] rounded-xl px-4 py-3 outline-none text-gray-700 placeholder:text-gray-400 resize-none focus:border-[#155955] focus:ring-2 focus:ring-[#155955]/10 transition"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-[#004643]">
                Price
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D8A85F] font-bold">
                  ₹
                </span>

                <input
                  type="number"
                  name="price"
                  placeholder="Enter product price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full border border-[#DEDCD2] bg-[#FAF9F6] rounded-xl pl-9 pr-4 py-3 outline-none text-gray-700 placeholder:text-gray-400 focus:border-[#155955] focus:ring-2 focus:ring-[#155955]/10 transition"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#004643] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#155955] transition"
              >
                {editingId ? "Update Product" : "Add Product"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="w-full sm:w-auto border border-[#DEDCD2] bg-white text-[#004643] px-6 py-3 rounded-xl font-semibold hover:bg-[#F0EDE5] transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Product List */}
        <div className="bg-white border border-[#DEDCD2] rounded-3xl shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-[#DEDCD2]">
            <h2 className="text-xl sm:text-2xl font-bold text-[#004643]">
              Product List
            </h2>

            <p className="text-sm text-gray-500 mt-1">Available gym products</p>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No products found.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#DEDCD2]">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 hover:bg-[#FAF9F6] transition"
                >
                  {/* Product Info */}
                  <div className="min-w-0">
                    <h3 className="font-bold text-lg text-[#004643]">
                      {product.name}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1 break-words">
                      {product.description || "No description"}
                    </p>

                    <div className="mt-3 inline-flex items-center bg-[#F0EDE5] px-3 py-1.5 rounded-full">
                      <span className="text-[#D8A85F] font-bold mr-1">₹</span>

                      <span className="font-semibold text-[#004643]">
                        {Number(product.price).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2 lg:flex-shrink-0">
                    <button
                      onClick={() => handleEdit(product)}
                      className="w-full sm:w-auto border border-[#155955] text-[#155955] px-5 py-2.5 rounded-xl font-semibold hover:bg-[#155955] hover:text-white transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(product.id)}
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

export default Products;
