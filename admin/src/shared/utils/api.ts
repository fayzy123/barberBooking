import axios from "axios";
import config from "./config";

const api = axios.create({
    baseURL: `${config.apiUrl}/api/admin`,
})

export default api;