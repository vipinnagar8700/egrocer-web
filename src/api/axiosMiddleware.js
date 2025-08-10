import axios from "axios";
import { store } from "@/redux/store"

const access_key_param = 'x-access-key';
const access_key = "903361";

const url = process.env.NEXT_PUBLIC_API_URL
const subUrl = process.env.NEXT_PUBLIC_API_SUBURL
const api = axios.create({
    baseURL: `${url}${subUrl}/`
})

const getStoredToken = async () => {
    const state = store.getState()
    return state?.User?.jwtToken
}

api.interceptors.request.use(
    async (config) => {
        try {
            const authToken = await getStoredToken()
            if (authToken) {
                config.headers.Authorization = `Bearer ${authToken}`
            }
            config.headers["Content-Type"] = "multipart/form-data"
            config.headers["x-access-key"] = access_key
            return config
        } catch (error) {
            console.error("Error in token retrival", error)
            return Promise.reject(error)
        }
    },
    (error) => {
        console.error("Error in inceptor", error)
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    (response) => {
        try {
            return response
        } catch (error) {
            console.error("Error while fetching data", error)
            return Promise.reject(error)
        }
    },
    (error) => {
        console.error("Error while fetching data", error)
        return Promise.reject(error)
    }
)

export default api;