"use client"
import { useState, useEffect } from "react";
import AddCategoryModal from "./AddCategoryModal";

export default function EditModal({
  isOpen,
  onClose,
  onSave,
  transaction,
  categories,
  onAddCategory
}) {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    type: "income",
    category: ""
  });

  const [showCategoryModal, setShowCategoryModal] = useState(false);

  useEffect(() => {
    if (transaction) {
      setFormData({
        title: transaction.title || "",
        amount: transaction.amount || "",
        type: transaction.type || "income",
        category: transaction.category || ""
      });
    }
  }, [transaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount || !formData.category) {
      alert("Please fill all fields");
      return;
    }
    onSave({ ...transaction, ...formData });
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
          <h2 className="text-lg font-bold mb-4">Edit Transaction</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <div className="relative">
              <select
                name="category"
                value={formData.category}
                onChange={(e) =>
                  e.target.value === "__add_new__"
                    ? setShowCategoryModal(true)
                    : handleChange(e)
                }
                className="w-full px-4 py-2 border border-gray-300 rounded"
              >
                <option value="" disabled>
                  -- Select Category --
                </option>

                {categories.map((cat, index) => (
                  <option key={cat.id ?? `${cat.name}-${index}`} value={cat.name}>
                    {cat.name}
                  </option>
                ))}

                <option value="__add_new__">➕ Add New Category</option>
              </select>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>

      {showCategoryModal && (
        <AddCategoryModal
          isOpen={showCategoryModal}
          onClose={() => setShowCategoryModal(false)}
          onSave={(newCategory) => {
            onAddCategory(newCategory);
            setFormData((prev) => ({ ...prev, category: newCategory.name }));
            setShowCategoryModal(false);
          }}
        />
      )}
    </>
  );
}
