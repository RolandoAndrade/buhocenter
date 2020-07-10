import { HttpRepository } from '@/http/http.repository';
import { Payment } from '../interfaces/payments.interface';
import { Orders, ProductsOrder } from '@/modules/client/customers/interfaces/orders.interface';

class PaymentsRepository extends HttpRepository {
    private static readonly RESOURCE = 'payments';

    /**
     * Permite crear una orden iniciando el proceso de checkout con la pasarela de pago
     * @param order objeto que incluye los items de la orden y el client que desea adquirir los products o services
     */
    async createOrder(order): Promise<Payment> {
        return await this.post(this.createUri([`${PaymentsRepository.RESOURCE}`]), order);
    }

    async getCustomerOrders(userId: number): Promise<Orders[]> {
        return await this.get(
            this.createUri([`${PaymentsRepository.RESOURCE}`], { userId }),
            this.createHeader(),
        );
    }

    async getOrderById(orderId: number): Promise<ProductsOrder> {
        return await this.get(
            this.createUri([`${PaymentsRepository.RESOURCE}/${orderId}`]),
            this.createHeader(),
        );
    }
}

export default new PaymentsRepository();
