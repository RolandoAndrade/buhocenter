import { CustomerStateInterface } from './interfaces/auth.state.interface';

export const CUSTOMER_EMPTY_STATE: CustomerStateInterface = {
    err_auth: false,
    err_message: '',
    err_register: false,
    err_register_message: '',
    token: '',
    apiAccessToken: '',
    data: {},
    error: '',
};
