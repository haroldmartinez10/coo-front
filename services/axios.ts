import axios from "axios";
import { signOut } from "next-auth/react";

import { store } from "@/shared/store/store";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const authStore = store.getState().auth;
    const token = authStore.token;

    if (!token) {
      return Promise.reject(new Error("No authorization token available"));
    }

    config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        await signOut({ callbackUrl: "/login" });
      }
    }
    return Promise.reject(error);
  }
);
