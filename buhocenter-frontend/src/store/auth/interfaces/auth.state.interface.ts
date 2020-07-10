import { CustomerInterface } from '@/modules/client/auth/interfaces/customer.interface';

export interface CustomerStateInterface {
    err_auth?: boolean;
    err_message?: string;
    err_register?: boolean;
    err_register_message?: string;
    token: string;
    apiAccessToken: string;
    data?: CustomerInterface;
    error?: string;
}
