import { HttpRepository } from '@/http/http.repository';

class CategoriesHttpRepository extends HttpRepository {
    private static readonly RESOURCE = 'categories';

    public getCategories() {
        return this.get(this.createUri([`${CategoriesHttpRepository.RESOURCE}`]));
    }
}

export default new CategoriesHttpRepository();