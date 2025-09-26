import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './index.css'
import { GoogleOAuthProvider } from "@react-oauth/google";

const CLIENT_ID= import.meta.env.VITE_GOOGLE_CLIENT_ID


ReactDOM.createRoot(document.getElementById("root")).render(
  <div className="bg-yellow-50 min-h-screen">
    <React.StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}> 
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
  </div>
  
);
