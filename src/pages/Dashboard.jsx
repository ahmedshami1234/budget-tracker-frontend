"use client"

import { useState, useEffect } from "react"
import Navbar from "../components/Navbar";
import DeleteModal from "../components/DeleteModal";
import EditModal from "../components/EditModal";
import axiosInstance from "../api/axiosInstance";
import axios from "axios";



export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editableTransaction, setEditableTransaction] = useState(null);



  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
  
      try {
        const res = await axios.get("http://localhost:5001/api/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const numericTransactions = res.data.map((txn) => ({
          ...txn,
          amount: Number(txn.amount),
        }));
  
        setTransactions(numericTransactions);
      } catch (err) {
        console.error("Error fetching transactions:", err);
      }
    };
  
    fetchTransactions();
  }, []);
  
  


  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    type: "income",
  })

  const [isLoading, setIsLoading] = useState(false)

  // Calculate totals
  // Correct balance: income - expenses
const balance = transactions.reduce((sum, txn) => {
  const amount = Number(txn.amount);
  return txn.type === "income" ? sum + amount : sum - amount;
}, 0);

// Sum all incomes
const income = transactions
  .filter((t) => t.type === "income")
  .reduce((sum, t) => sum + Number(t.amount), 0);

// Sum all expenses (positive)
const expenses = transactions
  .filter((t) => t.type === "expense")
  .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);


  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) return;
  
    setIsLoading(true);
    try {
      await axiosInstance.post("/transactions", {
        title: formData.title,
        amount: formData.amount,
        type: formData.type,
      });
  
      const res = await axiosInstance.get("/transactions");
const numericTransactions = res.data.map((txn) => ({
  ...txn,
  amount: Number(txn.amount),
}));
setTransactions(numericTransactions);
  
      setFormData({ title: "", amount: "", type: "income" });
    } catch (err) {
      console.error("Error submitting transaction", err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5001/api/transactions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Refresh transactions
      const res = await axios.get("http://localhost:5001/api/transactions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTransactions(res.data);
    } catch (err) {
      console.error("Delete error:", err);
      alert("Transaction deletion failed");
    }
  };

  const openDeleteModal = (txn) => {
    setSelectedTransaction(txn);
    setShowDeleteModal(true);
  };
  
  const handleDeleteConfirm = async () => {
    try {
      await axiosInstance.delete(`/transactions/${selectedTransaction.id}`);
      setTransactions(transactions.filter((t) => t.id !== selectedTransaction.id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete transaction");
    } finally {
      setShowDeleteModal(false);
      setSelectedTransaction(null);
      
    }
  };

  const openEditModal = (txn) => {
    setEditableTransaction(txn);
    setShowEditModal(true);
  };
  
  const handleEditSave = async (updated) => {
    try {
      await axiosInstance.put(`/transactions/${updated.id}`, {
        title: updated.title,
        amount: updated.amount,
        type: updated.type,
      });
  
      const res = await axiosInstance.get("/transactions");
      const numericTransactions = res.data.map((txn) => ({
        ...txn,
        amount: Number(txn.amount),
      }));
      setTransactions(numericTransactions);
  
      setShowEditModal(false);
      setEditableTransaction(null);
    } catch (err) {
      console.error("Edit error:", err);
      alert("Failed to update transaction.");
    }
  };
  
    

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Fixed Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Balance Card */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Balance</p>
                  <p className={`text-2xl font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatCurrency(balance)}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${balance >= 0 ? "bg-green-100" : "bg-red-100"}`}>
                  <svg
                    className={`w-6 h-6 ${balance >= 0 ? "text-green-600" : "text-red-600"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Income Card */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Income</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(income)}</p>
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Expenses Card */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(expenses)}</p>
                </div>
                <div className="p-3 rounded-full bg-red-100">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Add Transaction Form */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200 mb-8">
            <h2 className="text-lg font-bold text-[#0e141b] mb-4">Add New Transaction</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-[#0e141b] mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter transaction title"
                    className="w-full px-4 py-3 bg-slate-50 border border-[#d0dbe7] rounded-lg focus:ring-2 focus:ring-[#1978e5] focus:border-transparent placeholder:text-[#4e7097] text-[#0e141b]"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-[#0e141b] mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="Enter amount"
                    step="0.01"
                    className="w-full px-4 py-3 bg-slate-50 border border-[#d0dbe7] rounded-lg focus:ring-2 focus:ring-[#1978e5] focus:border-transparent placeholder:text-[#4e7097] text-[#0e141b]"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-[#0e141b] mb-2">
                    Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-[#d0dbe7] rounded-lg focus:ring-2 focus:ring-[#1978e5] focus:border-transparent text-[#0e141b]"
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#1978e5] hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
                >
                  {isLoading && (
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                  <span>{isLoading ? "Adding..." : "Add Transaction"}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Transactions Table */}
          <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-[#0e141b]">Recent Transactions</h2>
            </div>
            <div className="overflow-x-auto">
              {transactions.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-12 w-12 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-slate-900">No transactions</h3>
                  <p className="mt-1 text-sm text-slate-500">Get started by adding a new transaction.</p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
  <tr>
    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
      Title
    </th>
    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
      Amount
    </th>
    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
      Type
    </th>
    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
      Date
    </th>
    <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
      Actions
    </th>
  </tr>
</thead>

                  <tbody className="bg-white divide-y divide-slate-200">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-slate-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-[#0e141b]">{transaction.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div
                            className={`text-sm font-semibold ${transaction.amount >= 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {formatCurrency(Math.abs(transaction.amount))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              transaction.type === "income" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {transaction.type === "income" ? "Income" : "Expense"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-center space-x-4">
  <button
    onClick={() => openEditModal(transaction)}
    className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
  >
    Edit
  </button>
  <button
    onClick={() => openDeleteModal(transaction)}
    className="text-red-500 hover:text-red-700 font-semibold text-sm"
  >
    Delete
  </button>
</td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
      <DeleteModal
  isOpen={showDeleteModal}
  onClose={() => setShowDeleteModal(false)}
  onConfirm={handleDeleteConfirm}
  transaction={selectedTransaction}
/>

<EditModal
  isOpen={showEditModal}
  onClose={() => setShowEditModal(false)}
  onSave={handleEditSave}
  transaction={editableTransaction}
/>


    </div>
  )
}
