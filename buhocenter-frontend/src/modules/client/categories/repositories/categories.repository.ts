import { HttpRepository } from '@/http/http.repository';
import { Categories, Category } from '../interfaces/categories.interface';

class CategoriesHttpRepository extends HttpRepository {
    private static readonly RESOURCE = 'categories';

    public async getCategories(): Promise<Categories> {
        return await this.get(this.createUri([`${CategoriesHttpRepository.RESOURCE}`]));
    }

    public getAllCategories(): Promise<Category[]> {
        return this.get(this.createUri([`${CategoriesHttpRepository.RESOURCE}/all`]));
    }
}

export default new CategoriesHttpRepository();
