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

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50">
        {/* Header with Logout */}
        <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-yellow-200/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">💰</span>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                  Finance Tracker
                </h1>
              </div>
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold rounded-2xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
        
        <Dashboard />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 flex items-center justify-center p-4">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-orange-200/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-md w-full">
        {/* Welcome Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-yellow-200/50">
          <div className="text-center mb-8">
            {/* Logo/Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-3xl mb-6 shadow-lg">
              <span className="text-4xl">💰</span>
            </div>
            
            {/* Title */}
            <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-500 bg-clip-text text-transparent mb-3">
              Finance Tracker
            </h1>
            
            {/* Subtitle */}
                  <p className="text-gray-600 text-lg font-medium mb-2">
                    Track your expenses and income efficiently!
                  </p>
                  
                  <p className="text-gray-500 text-sm">
                    Your journey to financial freedom starts here
                  </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-8 flex flex-col items-center justify-center text-center">
                    <div className="flex items-center space-x-3 text-gray-600">
                      <span className="font-medium">Beautiful expense tracking</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-600">
                      <span className="font-medium">Real-time financial insights</span>
                    </div>
                    <div className="flex items-center space-x-3 text-gray-600">
                      <span className="font-medium">Secure Google authentication</span>
                    </div>
                  </div>

                  {/* Login Section */}
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-gray-600 font-medium mb-4">
                        Login with Google to get started
                      </p>
                    </div>
                    
                    <div className="flex justify-center items-center w-full">
                      <GoogleLoginButton onLoginSuccess={handleLoginSuccess} />
                    </div>
                  </div>

                  {/* Footer */}
          <div className="text-center mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-400 text-sm">
              Secure • Fast • Beautiful
            </p>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 text-center border border-yellow-200/30">
            <div className="text-2xl mb-1">🔒</div>
            <p className="text-xs text-gray-600 font-medium">Secure</p>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 text-center border border-yellow-200/30">
            <div className="text-2xl mb-1">⚡</div>
            <p className="text-xs text-gray-600 font-medium">Fast</p>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 text-center border border-yellow-200/30">
            <div className="text-2xl mb-1">✨</div>
            <p className="text-xs text-gray-600 font-medium">Beautiful</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;