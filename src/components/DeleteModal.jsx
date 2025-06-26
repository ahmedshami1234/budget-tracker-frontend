import React from "react";

export default function DeleteModal({ isOpen, onClose, onConfirm, transaction }) {
  if (!isOpen || !transaction) return null;

  return (
    <>
      {/* Blurred backdrop */}
      <div className="fixed inset-0 backdrop-blur-sm bg-white/30 z-40" onClick={onClose}></div>

      {/* Modal content */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md border border-slate-200">
          <h2 className="text-lg font-bold text-[#0e141b] mb-4">Confirm Deletion</h2>
          <p className="text-slate-700 mb-4">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-red-600">"{transaction.title}"</span> with amount{" "}
            <span className="font-semibold text-red-600">${transaction.amount}</span>?
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium transition"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
