import axios, { AxiosInstance } from 'axios';

const httpcustomer: AxiosInstance = axios.create({
    baseURL: `${process.env.VUE_APP_BUHOCENTER_API_URL}${process.env.VUE_APP_BUHOCENTER_API_PREFIX}`,
    timeout: 60000,
});

httpcustomer.interceptors.response.use((response) => response.data);

export default httpcustomer;
