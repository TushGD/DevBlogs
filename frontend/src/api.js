const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const parseResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
};

export const apiRequest = async (endpoint, options = {}, token) => {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  return parseResponse(response);
};

export { API_URL };
