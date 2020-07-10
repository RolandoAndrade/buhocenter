import { HttpRepository } from '@/http/http.repository';
import { PacketBasicInformationInterface } from '@/modules/client/checkout/interfaces/packetBasicInformation.interface';
import { CustomerLoyaltyUpdateProductPointsInterfaces } from '@/modules/client/checkout/interfaces/customerLoyaltyUpdateProductPoints.interfaces';
import { payObjectCheckoutInterfaces } from '@/modules/client/checkout/interfaces/payObjectCheckout.interfaces';
import { NewPayment } from '@/modules/client/checkout/interfaces/newPayment.interface';

class CheckoutRepository extends HttpRepository {
    private static readonly SEND_PACKET = 'send-packet';
    private static readonly PRODUCTS_POINTS = 'third-party/update-products-points';
    private static readonly PAYMENT_ORDERS = 'payments/orders';

    /**
     * Envia la informacion basica de los productos a comprar
     * para que BE pueda comunicarse con la plataforma de SHIPTHIS
     * y devolver los precios del seguro de los productos segun la direccion
     * @param data objeto que contiene todos los datos necesarios para comunicarse con SHIPTHIS
     */
    public async sendPacketInfo(data: PacketBasicInformationInterface) {
        return await this.post(
            this.createUri([`${CheckoutRepository.SEND_PACKET}`]),
            data,
            this.createHeader(),
        );
    }

    /**
     * Envia la informacion basica de los productos a comprar
     * para que BE pueda comunicarse con la plataforma de PETROMILES
     * y devolver los puntos acumulados de hacer la compra en el sistema
     * @param data objeto que contiene todos los datos necesarios para comunicarse con PETROMILES
     */
    public async updateProductPoints(data: CustomerLoyaltyUpdateProductPointsInterfaces) {
        return await this.post(
            this.createUri([`${CheckoutRepository.PRODUCTS_POINTS}`]),
            data,
            this.createHeader(),
        );
    }

    public async paymentOrders(data: payObjectCheckoutInterfaces): Promise<NewPayment> {
        return await this.post(
            this.createUri([`${CheckoutRepository.PAYMENT_ORDERS}`]),
            data,
            this.createHeader(),
        );
    }
}

export default new CheckoutRepository();
