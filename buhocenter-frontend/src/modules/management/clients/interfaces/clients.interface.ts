import { Status } from '@/modules/common/interfaces/status.interface';
import { Rol } from './role.interface';
export interface ClientInterface {
    id?: number;
    createdAt?: Date;
    updatedAt?: Date;
    name?: string;
    lastName?: string;
    birthdate?: string;
    email?: string;
    is_federate?: boolean;
    uid?: string;
    token?: string;
    languaje?: string;
    status?: Status;
    foreignExchange?: number;
    role?: Rol;
}

export interface ClientResponse {
    error?: string;
    message?: string;
}
