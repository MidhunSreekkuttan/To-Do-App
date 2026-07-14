import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    timeout: 10000, // Request will fail if it takes longer than 10 seconds
    headers: {
        'Content-Type': 'application/json'
    }
})

export default axiosInstance