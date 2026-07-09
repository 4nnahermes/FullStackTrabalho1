import axios, { type InternalAxiosRequestConfig } from "axios";

export const api = axios.create({
    baseURL: "http://localhost:3000",
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");

    if (token && config.headers) {
        config.headers.set("Authorization", token);
    }

    return config;
});