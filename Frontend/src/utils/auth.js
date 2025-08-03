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

  try {
    const res = await fetch("http://localhost:8000/api/auth/token/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh }),
    });

    if (!res.ok) throw new Error("Refresh failed");

    const data = await res.json();
    saveTokens({ access: data.access, refresh });
    return data.access;
  } catch (error) {
    console.error("Token refresh failed:", error);
    clearTokens();
    window.location.href = "/"; // redirect to login
  }
};
