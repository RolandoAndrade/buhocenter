import { BrandInterface } from '@/modules/client/brand/interfaces/brand.interface';
import { Category } from '@/modules/client/categories/interfaces/categories.interface';
import { Catalogue } from '@/modules/client/catalogues/interfaces/catalogues.interface';

export interface LayoutStateInterface {
    catalogue?: Catalogue;
    category?: Category;
}
