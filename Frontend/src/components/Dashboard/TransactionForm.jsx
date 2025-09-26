import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../../utils/api';

const TransactionForm = ({ onAddTransaction, editingTransaction, onEditTransaction }) => {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    transaction_type: "EXPENSE",
  });

  const [isLoading, setIsLoading] = useState(false);

  // 🔁 Prefill form if editing
  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        title: editingTransaction.title,
        amount: editingTransaction.amount,
        transaction_type: editingTransaction.transaction_type,
      });
    }
  }, [editingTransaction]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingTransaction) {
        //  EDIT MODE - PUT to detail endpoint
        const res = await fetchWithAuth(
          `http://localhost:8000/api/transactions/${editingTransaction.id}/`,
          {
            method: "PUT",
            body: JSON.stringify(formData),
          }
        );

        if (res.ok) {
          const updatedTransaction = await res.json();
          onEditTransaction(updatedTransaction);
        } else {
          console.log("Failed to update transaction:", res.statusText);
        }
      } else {
        //  ADD MODE - POST
        const res = await fetchWithAuth("http://localhost:8000/api/transactions/", {
          method: "POST",
          body: JSON.stringify(formData),
        });

        if (res.ok) {
          const newTransaction = await res.json();
          onAddTransaction(newTransaction);
        } else {
          console.log("Failed to add transaction:", res.statusText);
        }
      }

      // ✅ Reset form
      setFormData({
        title: "",
        amount: "",
        transaction_type: "EXPENSE",
      });
    } catch (error) {
      console.error("Error submitting transaction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-yellow-200/50 hover:shadow-2xl transition-all duration-300">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent mb-2">
          {editingTransaction ? "Edit Transaction" : "Add New Transaction"}
        </h2>
        <p className="text-gray-600">{editingTransaction ? "Update your transaction details" : "Record your income or expense"}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Transaction Type Selector */}
        <div className="grid grid-cols-2 gap-3 p-2 bg-gray-100/50 rounded-2xl">
          {["EXPENSE", "INCOME"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData({ ...formData, transaction_type: type })}
              className={`py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                formData.transaction_type === type
                  ? type === "EXPENSE"
                    ? "bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-lg transform scale-105"
                    : "bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg transform scale-105"
                  : "bg-transparent text-gray-600 hover:bg-gray-200/50"
              }`}
            >
              {type.charAt(0) + type.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Title Input */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
            Transaction Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            placeholder="e.g., Coffee, Salary, Groceries..."
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full px-4 py-4 bg-white/70 border-2 border-yellow-200 rounded-2xl focus:border-yellow-400 focus:ring-4 focus:ring-yellow-200/50 outline-none transition-all duration-200 text-gray-800 placeholder-gray-400"
          />
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <label className="flex items-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg font-bold">$</span>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              placeholder="0.00"
              step="0.01"
              min="0"
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
              className="w-full pl-8 pr-4 py-4 bg-white/70 border-2 border-yellow-200 rounded-2xl focus:border-yellow-400 focus:ring-4 focus:ring-yellow-200/50 outline-none transition-all duration-200 text-gray-800 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform ${
            isLoading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : formData.transaction_type === "INCOME"
              ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl hover:scale-105"
              : "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl hover:scale-105"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {editingTransaction ? "Updating..." : "Adding..."}
            </span>
          ) : (
            <span className="flex items-center justify-center">
              {editingTransaction ? "Update" : "Add"} {formData.transaction_type === "INCOME" ? "Income" : "Expense"}
            </span>
          )}
        </button>

        {/* Quick Amounts */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-600 text-center">Quick Amounts</p>
          <div className="grid grid-cols-4 gap-2">
            {[10, 25, 50, 100].map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => setFormData({ ...formData, amount: amount.toString() })}
                className="py-2 px-3 bg-yellow-100 hover:bg-yellow-200 rounded-xl text-sm font-medium text-gray-700 transition-all duration-200 hover:scale-105"
              >
                ${amount}
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
