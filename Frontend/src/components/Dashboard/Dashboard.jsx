import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../utils/api";


const Dashboard = () => {
  // State to hold transactions and form data
  const [transactions, setTransactions] = useState([]);
  // Form data state for adding new transactions
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    transaction_type: "EXPENSE",
  });


  // Load transactions when the component mounts
  // This will fetch the transactions from the API using the fetchWithAuth function
  // which handles authentication and token refresh.
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



  // Handle form submission to add a new transaction
  // This function will send a POST request to the API with the transaction data
  // and update the state with the new transaction if successful.
  // It also resets the form data after submission.
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetchWithAuth("http://localhost:8000/api/transactions/", {
        method: "POST",
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const newTransaction = await res.json();
        setTransactions((prev)=>[...prev, newTransaction])
        setFormData({
          title: "",
          amount: "",
          transaction_type: "EXPENSE"
        })
      } else {
        console.log("Failed to add transaction:", res.statusText);
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  }

  return (
    <div>
      {/* // Form for adding transactions */}
      <h3>Add a New Transaction</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={formData.title}
          placeholder="Title"
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <input
          type="number"
          name="amount"
          value={formData.amount}
          placeholder="Amount"
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          required
        />
        <select
          name="transaction_type"
          value={formData.transaction_type}
          onChange={(e) => setFormData({ ...formData, transaction_type: e.target.value })}
        >
          <option value="EXPENSE">Expense</option>
          <option value="INCOME">INCOME</option>
        </select>
        <button type="submit">Add Transaction</button>
      </form>


      {/* // Display the list of transactions */}
      <h2>Your Transactions</h2>
      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <ul>
          {transactions.map((transaction) => (
            <li key={transaction.id}>
              {transaction.title} - ${transaction.amount} ({transaction.transaction_type}) on{" "}
              {new Date(transaction.created_at).toLocaleDateString()}
            </li>

          ))}
        </ul>
      )}


    </div>
  );
};

export default Dashboard;
