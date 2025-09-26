import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../utils/api";
import TransactionForm from "./TransactionForm";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDiamond, faEnvelope, faMoneyBill1, faSackDollar } from "@fortawesome/free-solid-svg-icons";
import { faMoneyCheckDollar } from '@fortawesome/free-solid-svg-icons'




const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState("ALL");
  const [editingTransaction, setEditingTransaction] = useState(null);



  const displayedTransactions = transactions.filter((transaction) =>
    filterType === "ALL" || transaction.transaction_type === filterType
  );

  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.transaction_type === "INCOME")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpense = transactions
    .filter(t => t.transaction_type === "EXPENSE")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const netBalance = totalIncome - totalExpense;

  useEffect(() => {
    async function loadTransactions() {
      try {
        const res = await fetchWithAuth("http://localhost:8000/api/transactions/");
        const data = await res.json();
        setTransactions(data);
      } catch (err) {
        console.error("Error loading transactions:", err);
      }
    }

    loadTransactions();
  }, []);

  //Handle adding a new transaction
  const handleAddTransaction = (newTransaction) => {
    setTransactions((prev) => [...prev, newTransaction]);
  };


  //handle deleting a transaction
  const handleDeleteTransaction = async (id) => {
    try {
      const response = await fetchWithAuth(`http://localhost:8000/api/transactions/${id}/`, {
        method: "DELETE"
      });

      if (response.ok) {
        setTransactions((prev) => prev.filter((t) => t.id !== id));
        console.log("Transaction deleted successfully");
      } else {
        console.error("Failed to delete transaction:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };


  //handle editing a transaction
  const handleEditTransaction = (updatedTransaction) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === updatedTransaction.id ? updatedTransaction : t))
    );
    setEditingTransaction(null) 
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-500 bg-clip-text text-transparent mb-4">
            💰 Finance Dashboard
          </h1>
          <p className="text-gray-600 text-lg font-medium">
            Track your financial journey with style
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Income */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-yellow-200/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Income</p>
                <p className="text-3xl font-bold text-green-600">${totalIncome.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                <FontAwesomeIcon icon={faSackDollar} className="text-2xl" />
              </div>
            </div>
          </div>

          {/* Total Expenses */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-yellow-200/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total Expenses</p>
                <p className="text-3xl font-bold text-red-500">${totalExpense.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                <FontAwesomeIcon icon={faMoneyCheckDollar} className="text-2xl" />
              </div>
            </div>
          </div>

          {/* Net Balance */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-yellow-200/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Net Balance</p>
                <p className={`text-3xl font-bold ${netBalance >= 0 ? 'text-blue-600' : 'text-orange-500'}`}>
                  ${Math.abs(netBalance).toFixed(2)}
                </p>
              </div>
              <div className="w-12 h-12 pl-2 bg-blue-100 rounded-2xl flex items-center justify-between">
                <FontAwesomeIcon icon={faMoneyBill1} className="text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Transaction Form */}
          <div className="order-2 lg:order-1">
            <TransactionForm 
              onAddTransaction={handleAddTransaction}
              editingTransaction={editingTransaction}
              onEditTransaction={handleEditTransaction}
            />
          </div>

          {/* Transactions List */}
          <div className="order-1 lg:order-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-yellow-200/50">
              {/* Filter Section */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                  Transaction History
                </h2>

                {/* Filter Buttons */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {['ALL', 'INCOME', 'EXPENSE'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-4 py-2 rounded-2xl font-medium text-sm transition-all duration-200 ${filterType === type
                          ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-lg transform scale-105'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'
                        }`}
                    >
                      {type === 'ALL' ? 'All' : type === 'INCOME' ? 'Income' : 'Expense'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transactions List */}
              <div className="max-h-96 overflow-y-auto space-y-3">
                {displayedTransactions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📋</div>
                    <p className="text-gray-500 text-lg">No transactions found</p>
                    <p className="text-gray-400 text-sm">Add your first transaction to get started!</p>
                  </div>
                ) : (
                  displayedTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="group bg-white/60 rounded-2xl p-4 border border-yellow-100 hover:border-yellow-300 transition-all duration-200 hover:shadow-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${transaction.transaction_type === 'INCOME'
                              ? 'bg-green-100'
                              : 'bg-red-100'
                            }`}>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800 text-lg">
                              {transaction.title}
                            </h3>
                            <p className="text-gray-500 text-sm">
                              {new Date(transaction.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <span className={`text-xl font-bold ${transaction.transaction_type === 'INCOME'
                              ? 'text-green-600'
                              : 'text-red-500'
                            }`}>
                            {transaction.transaction_type === 'INCOME' ? '+' : '-'}
                            ${parseFloat(transaction.amount).toFixed(2)}
                          </span>

                          <button
                            onClick={() => handleDeleteTransaction(transaction.id)}
                            className="w-8 h-8 rounded-full bg-red-100 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-90 hover:scale-100"
                            title="Delete transaction"
                          >
                            🗑️
                          </button>
                          <button
                            onClick={() => setEditingTransaction(transaction)}
                            className="w-8 h-8 rounded-full bg-blue-100 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-90 hover:scale-100"
                            title="Edit transaction"
                          >
                            ✏️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;