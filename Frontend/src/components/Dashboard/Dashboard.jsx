import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../utils/api";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);

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

  return (
    <div>
      <h2>Your Transactions</h2>
      <pre>{JSON.stringify(transactions, null, 2)}</pre>
    </div>
  );
};

export default Dashboard;
