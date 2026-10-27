import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000/notes/api";

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      return Promise.reject({
        status: error.response.status,
        message: error.response.data?.message ?? "Something went wrong",
        data: error.response.data,
      });
    }

    return Promise.reject({
      status: 500,
      message: error.message ?? "Network error",
    });
  }
);
