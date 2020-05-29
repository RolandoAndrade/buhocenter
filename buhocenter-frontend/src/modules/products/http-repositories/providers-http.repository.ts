import { HttpRepository } from "@/http/http.repository";

class ProvidersHttpRepository extends HttpRepository {

    private static readonly RESOURCE ='providers';

    public async getProviders(): Promise<any> {        
        return await this.get(this.createUri([`${ProvidersHttpRepository.RESOURCE}`]));            
    }
}

export default new ProvidersHttpRepository();