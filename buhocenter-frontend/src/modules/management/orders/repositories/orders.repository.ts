import { HttpRepository } from '@/http/http.repository';
import { Orders } from '../interfaces/orders.interface';

class OrderRepository extends HttpRepository {
    private static readonly RESOURCE = 'payments';

    getOrders(start: number, limit: number): Promise<Orders> {
        return this.get(
            this.createUri([`${OrderRepository.RESOURCE}?start=${start}&limit=${limit}`]),
            this.createHeader(),
        );
    }
}

export default new OrderRepository();
