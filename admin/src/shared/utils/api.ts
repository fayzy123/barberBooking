import axios from "axios";
import config from "./config";

const api = axios.create({
    baseURL: `${config.apiUrl}/api/admin`,
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token")
            localStorage.removeItem("admin")
            window.location.href = "/login?reason=session_expired"
        }
        return Promise.reject(error)
    }
)

export default api;