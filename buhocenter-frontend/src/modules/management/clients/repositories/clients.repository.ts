import { HttpRepository } from '@/http/http.repository';
import { ClientInterface, ClientResponse } from '../interfaces/clients.interface';
class ClientsRepository extends HttpRepository {
    private static readonly RESOURCE = 'users';

    blockAndUnblockClients(client: ClientInterface): Promise<ClientResponse> {
        return this.patch(this.createUri([`${ClientsRepository.RESOURCE}`]), client, this.createHeader());
    }

    getAllClients(): Promise<ClientResponse> {
        return this.get(this.createUri([`${ClientsRepository.RESOURCE}`]), this.createHeader());
    }
}

export default new ClientsRepository();
