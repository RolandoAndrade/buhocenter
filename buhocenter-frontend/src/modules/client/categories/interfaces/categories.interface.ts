import { Catalogue } from '../../catalogues/interfaces/catalogues.interface';

export interface Category {
    createdAt?: string;
    icon?: string;
    id?: number;
    name?: string;
    term?: string;
    updatedAt?: string;
    catalogues?: Catalogue[];
}

export interface Categories {
    categories?: Category[];
}
