export default {
    mutations: {
        AUTH_GOOGLE_SUCCESS: 'AUTH_GOOGLE_SUCCESS',
        AUTH_ERR: 'AUTH_ERR',
        LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',
        REGISTER_SUCCESS: 'REGISTER_SUCCESS',
        REGISTER_ERR: 'REGISTER_ERR',
        SET_CUSTOMER_DATA: 'SET_CUSTOMER_DATA',
    },
    getters: {
        GET_AUTH_TOKEN: 'GET_AUTH_TOKEN',
        GET_ERR_MESSAGES: 'GET_ERR_MESSAGES',
        GET_ERR_AUTH: 'GET_ERR_AUTH',
        GET_CLIENT_DATA: 'GET_CLIENT_DATA',
        GET_ERR_REGISTER_MESSAGES: 'GET_ERR_REGISTER_MESSAGES',
        GET_ERR_REGISTER: 'GET_ERR_REGISTER',
    },
    actions: {
        LOGIN_SOCIAL: 'LOGIN_SOCIAL',
        REGISTER_CUSTOMER: 'REGISTER_CUSTOMER',
        LOGOUT : 'LOGOUT',
        LOGIN: 'LOGIN',
        UPDATE_CUSTOMER: 'UPDATE_CUSTOMER',
        MODIFY_CLIENT_DATA: 'MODIFY_CLIENT_DATA',
        UPDATE_CREDENTIALS: 'UPDATE_CREDENTIALS',
    },
};