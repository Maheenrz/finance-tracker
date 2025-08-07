import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const GoogleLoginButton = ({ onLoginSuccess }) => {
  const handleLoginSuccess = async (credentialResponse) => {
    try {
      console.log("Google credential response:", credentialResponse);
      
      // Send the ID token to the backend
      const response = await axios.post("http://localhost:8000/api/auth/google/", {
        id_token: credentialResponse.credential,
      });

      console.log("Backend response:", response.data);
      
      const { access, refresh } = response.data;

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      console.log("✅ Google Login successful");
      
      // Notify parent component of successful login
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (error) {
      console.error("❌ Login failed:", error.response?.data || error.message);
      console.error("Full error object:", error);
      
      // Log the full response for debugging
      if (error.response) {
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
        console.error("Response headers:", error.response.headers);
      }
    }
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError={() => console.log("Google Login Failed")}
      />
    </div>
  );
};

export default GoogleLoginButton;