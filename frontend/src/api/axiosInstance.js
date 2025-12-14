import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api"; 

export const createAxiosInstance = (token) => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
  });

  
  instance.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return instance;
};
