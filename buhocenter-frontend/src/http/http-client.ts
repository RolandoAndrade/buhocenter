import axios, { AxiosInstance } from 'axios';

// Modificar el baseURL con las variables de ambiente
const httpcustomer: AxiosInstance = axios.create({
    baseURL: `http://localhost:3000/api/v1`,
    timeout: 60000,
});

httpcustomer.interceptors.response.use((response) => response.data);

export default httpcustomer;