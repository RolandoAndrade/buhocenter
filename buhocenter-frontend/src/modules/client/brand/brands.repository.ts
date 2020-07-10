import { HttpRepository } from '@/http/http.repository';

class BrandsHttpRepository extends HttpRepository {
    private static readonly RESOURCE = 'brands';

    public async getBrands(): Promise<any> {
        return await this.get(this.createUri([`${BrandsHttpRepository.RESOURCE}`]));
    }
}

export default new BrandsHttpRepository();
