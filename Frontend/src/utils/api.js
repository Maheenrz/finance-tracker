import { getAccessToken, refreshAccessToken } from "./auth";

export const fetchWithAuth = async (url, options = {}) => {
  let token = getAccessToken();

  let res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (res.status === 401) {
    // Access token might be expired → try refresh
    token = await refreshAccessToken();

    res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  }

  return res;
};
