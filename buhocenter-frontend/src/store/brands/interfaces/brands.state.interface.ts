import { BrandInterface } from '@/modules/client/brand/interfaces/brand.interface';

export interface BrandsStateInterface {
    brands?: BrandInterface[];
    err_brands: boolean;
}
