export const getAccessToken = () => localStorage.getItem("access_token");
export const getRefreshToken = () => localStorage.getItem("refresh_token");

export const saveTokens = ({ access, refresh }) => {
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
};

export const clearTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

export const refreshAccessToken = async () => {
  const refresh = getRefreshToken();

  if (!refresh) {
    console.log("No refresh token available");
    return null;
  }

  try {
    console.log("Attempting to refresh token...");
    const res = await fetch("http://localhost:8000/api/auth/token/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh }),
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error("Refresh failed:", res.status, errorData);
      throw new Error(`Refresh failed: ${res.status}`);
    }

    const data = await res.json();
    console.log("Token refreshed successfully");
    
    // Save new tokens - note: some JWT implementations only return access token
    if (data.refresh) {
      saveTokens({ access: data.access, refresh: data.refresh });
    } else {
      // If no new refresh token, keep the old one
      localStorage.setItem("access_token", data.access);
    }
    
    return data.access;
  } catch (error) {
    console.error("Token refresh failed:", error);
    clearTokens();
    // Don't redirect immediately, let the calling component handle it
    return null;
  }
};