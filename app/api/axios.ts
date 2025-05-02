import axios, { AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "http://192.168.1.7:8081",
  headers: { "Content-Type": "application/json" },
});

export default api;