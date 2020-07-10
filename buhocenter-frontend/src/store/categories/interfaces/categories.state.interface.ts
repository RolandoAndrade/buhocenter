import { Category } from '@/modules/client/categories/interfaces/categories.interface';

export interface CategoryStateInterface {
    categories?: Category[];
    categoriesAndPhotosLoaded: boolean;
    totalCategories: number;
}
