import axios from "axios";

const BASE_URL = "https://personal-blog-lh7z.onrender.com";

export default axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
