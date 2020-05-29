import { HttpRepository } from "@/http/http.repository";

class ServicesHttpRepository extends HttpRepository {
    private static readonly RESOURCE = 'services';

    getServiceById(id: number) {
        return this.get(this.createUri([`${ServicesHttpRepository.RESOURCE}`, `${id}`]));
    }
}

export default new ServicesHttpRepository();