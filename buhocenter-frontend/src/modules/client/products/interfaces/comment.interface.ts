import { user } from '@/modules/client/auth/interfaces/user.interface';

export interface Comment {
    id?: number;
    createdAt?: String;
    updatedAt?: String;
    rating?: number;
    comment?: string;
    date?: String;
    user?: user;
    error?: string;
}
