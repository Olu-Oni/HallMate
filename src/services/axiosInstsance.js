import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001", // Change this to your JSON server or API URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
