import { getAccessToken, refreshAccessToken, clearTokens } from "./auth";

export const fetchWithAuth = async (url, options = {}) => {
  let token = getAccessToken();

  // If no token available, don't
  // attempt the request
  if (!token) {
    throw new Error("No authentication token available");
  }

  // First attempt with current token
  let res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  // If unauthorized, try to refresh token ONCE
  if (res.status === 401) {
    console.log("Token expired, attempting refresh...");
    
    try {
      const newToken = await refreshAccessToken();

      if (!newToken) {
        throw new Error("Failed to refresh token");
      }

      // Retry the original request with new token
      console.log("Retrying request with new token...");
      res = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newToken}`,
          "Content-Type": "application/json",
        },
      });

      // If still unauthorized after refresh, clear tokens
      if (res.status === 401) {
        console.error("Still unauthorized after token refresh");
        clearTokens();
        throw new Error("Authentication failed after token refresh");
      }

    } catch (err) {
      console.error("Failed to refresh token:", err);
      clearTokens();
      throw new Error("Authentication failed");
    }
  }

  return res;
};