import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "http://propshare.roavira.com",
  headers: { "Content-Type": "application/json" },
});

export default api;