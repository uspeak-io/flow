import axios from "axios";
const BASE_URL = process.env.REACT_APP_SLIGHT_ENDPOINT
const AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    }
}) 

export default AxiosInstance