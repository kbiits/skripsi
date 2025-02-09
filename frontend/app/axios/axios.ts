import axios, { AxiosError } from "axios";
import Router from 'next/navigation'

// Set config defaults when creating the instance
const fetcher = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

fetcher.interceptors.response.use(null, (error) => {
    if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
            Router.redirect('/');
        }
    }

    return Promise.reject(error);
})

export default fetcher;