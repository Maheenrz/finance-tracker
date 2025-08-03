import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const GoogleLogin = () => {
   const handleLoginSuccess = async (credentialResponse) => {
    try{
  const googleAccessToken = credentialResponse.credentialResponse

     const response = await axios.post('http://localhost:8000/api/auth/google/',{
        access_token: googleAccessToken,
     })

     const {access, refresh} = response.data;
     localStorage.setItem('access_token', access)
     localStorage.setItem('refresh_token', refresh);

     console.log("Google Login successful:");

    } catch (error) {
      console.error("Login failed:", error);
    }
  }

  return (
    <div>
        <GoogleLogin
        onSuccess={handleLoginSuccess}
        onError = {() => console.log("Login Failed")}/>
    </div>

  )
}

export default GoogleLogin;