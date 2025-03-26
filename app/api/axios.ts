import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "https://admin.propshare.online",
  headers: { "Content-Type": "application/json" },
});

export default api;
