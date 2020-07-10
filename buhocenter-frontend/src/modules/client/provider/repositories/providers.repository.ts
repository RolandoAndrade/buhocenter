import { HttpRepository } from '@/http/http.repository';
import { Provider } from '../interfaces/provider.interface';

class ProvidersHttpRepository extends HttpRepository {
    private static readonly RESOURCE = 'providers';

    public async getProviders(): Promise<Provider[]> {
        return await this.get(this.createUri([`${ProvidersHttpRepository.RESOURCE}`]));
    }
}

export default new ProvidersHttpRepository();
