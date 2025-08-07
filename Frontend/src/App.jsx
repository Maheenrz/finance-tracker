import GoogleLoginButton from './components/GoogleLogin/GoogleLoginButton.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import React, { useState, useEffect } from 'react';
import { getAccessToken } from './utils/auth.js';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in on app load
    const token = getAccessToken();
    setIsLoggedIn(!!token);
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsLoggedIn(false);
  };

  return (
    <div>
      <h1>Welcome to Finance Tracker</h1>
      
      {!isLoggedIn ? (
        <div>
          <p>Track your expenses and income efficiently!</p>
          <p>Login with Google to get started.</p>
          <GoogleLoginButton onLoginSuccess={handleLoginSuccess} />
          <p>Manage your finances with ease.</p>
          <p>Stay on top of your financial goals.</p>
        </div>
      ) : (
        <div>
          <button onClick={handleLogout} style={{marginBottom: '20px'}}>
            Logout
          </button>
          <Dashboard />
        </div>
      )}
    </div>
  );
}

export default App;