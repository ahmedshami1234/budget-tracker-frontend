import React, { useState, useEffect } from "react";

export default function EditModal({ isOpen, onClose, onSave, transaction }) {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    type: "income",
  });

  useEffect(() => {
    if (transaction) {
      setForm({
        title: transaction.title,
        amount: transaction.amount,
        type: transaction.type,
      });
    }
  }, [transaction]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, id: transaction.id });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
        <h2 className="text-lg font-bold text-[#0e141b] mb-4">Edit Transaction</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          <input
            name="amount"
            value={form.amount}
            onChange={handleChange}
            type="number"
            placeholder="Amount"
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="text-gray-600">
              Cancel
            </button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
