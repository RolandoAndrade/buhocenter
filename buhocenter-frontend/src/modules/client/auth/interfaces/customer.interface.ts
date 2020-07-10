import { Address } from '../../addresses/interfaces/address.interface';
import { Role } from './role.interface';

export interface CustomerInterface {
    name?: string;
    lastname?: string;
    lastName?: string;
    birthdate?: string;
    birthDate?: string;
    email?: string;
    password?: string;
    language?: string;
    uid?: string;
    id?: number;
    role?: Role;
    is_federate?: boolean;
    addresses?: Address[];
    status?: any;
    cellphone?: string;
}

export interface FederatedCustomer {
    first_name: string;
    last_name?: string;
    uid: string;
    email: string;
}

export interface ResponseAuth {
    apiAccessToken: string;
    token: string;
    data: CustomerInterface;
}

export interface ResponseRegister {
    message?: string;
    error?: string;
}
