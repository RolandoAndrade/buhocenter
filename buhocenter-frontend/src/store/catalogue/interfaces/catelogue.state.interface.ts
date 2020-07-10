import { Catalogue } from '@/modules/client/catalogues/interfaces/catalogues.interface';

export interface CatalogueStateInterface {
    catalogues: Catalogue[];
    err_catalogues: boolean;
    fetched_catalogues: boolean;
}
