import { HttpRepository } from "@/http/http.repository";

class CustomersRepository extends HttpRepository {
    private static readonly RESOURCE = 'users';

    updateCustomer(customer) {
        return this.patch(this.createUri([`${CustomersRepository.RESOURCE}`]), customer);
    }
}

export default new CustomersRepository();