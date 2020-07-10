import { Injectable, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { SendPacketRepository } from '../repositories/send-packet.repository';
import { ShippingOrderRequest } from '../interfaces/shipping-order-request';
import { User } from '../../users/entities/user.entity';
import { ShippingOrderItems } from '../interfaces/shipping-order-items.interface';
import { Product } from '../../products/entities/product.entity';
import { Cart } from '../../carts/entities/cart.entity';
import { PACKAGE_SYSTEM } from '../../../config/constants';
import { ConfigKeys } from '../../../config/config.keys';

@Injectable()
export class SendPacketService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private readonly sendPacketRepository: SendPacketRepository,
    ) {}

    private getItemCharacteristics(
        product: Product & { hasInsurance: boolean },
    ): { characteristic_id: number }[] {
        const characteristics: { characteristic_id: number }[] = [];

        if (product.fragile) {
            characteristics.push({ characteristic_id: PACKAGE_SYSTEM.CHARACTERISTICS.FRAGILE });
        } else if (product.hasInsurance) {
            characteristics.push({ characteristic_id: PACKAGE_SYSTEM.CHARACTERISTICS.HAS_INSURANCE });
        }

        return characteristics;
    }

    private getItems(productCarts: Product[] | Cart[]): ShippingOrderItems[] {
        const items = [];

        productCarts.forEach(i => {
            const characteristics = this.getItemCharacteristics(i);

            for (let j = 0; j < i.quantity; j++) {
                items.push({
                    description: i.description,
                    item_weight: parseFloat(i.productDimension.weight),
                    item_length: parseFloat(i.productDimension.long),
                    item_width: parseFloat(i.productDimension.width),
                    item_height: parseFloat(i.productDimension.height),
                    characteristics,
                });
            }
        });

        return items;
    }

    /**
     *
     * @param shippingPackage
     */
    public async sendPacket(shippingPackage) {
        const address: string = `${shippingPackage.user.address.firstStreet} ${shippingPackage.user.address.secondStreet} ${shippingPackage.user.address.city} ${shippingPackage.user.address.state} US ${shippingPackage.user.address.zipcode}`;

        const request: ShippingOrderRequest = {
            commercial_ally_api_key: process.env.SHIPTHIS_API_KEY,
            Warehouse_id: PACKAGE_SYSTEM.WAREHOUSE,
            rec_first_name: shippingPackage.user.name,
            rec_last_name: shippingPackage.user.lastName,
            rec_email: shippingPackage.user.email,
            rec_phone_number: shippingPackage.user.cellphone,
            destination_address: address,
            items: this.getItems(shippingPackage.productCarts),
        };

        return await this.sendPacketRepository.GetPacketShippingPrice(request);
    }

    public async createShippingOrder(user: User, checkout) {
        const address: string = `${checkout.address.firstStreet} ${checkout.address.secondStreet} ${checkout.address.city} ${checkout.address.state} US ${checkout.address.zipcode}`;
        const request: ShippingOrderRequest = {
            commercial_ally_api_key: process.env.SHIPTHIS_API_KEY,
            Warehouse_id: PACKAGE_SYSTEM.WAREHOUSE,
            rec_first_name: user.name,
            rec_last_name: user.lastName,
            rec_email: user.email,
            rec_phone_number: checkout.cellphone,
            destination_address: address,
            items: this.getItems(this.transformProductsForShipping(checkout.cartsForPayment)),
        };

        return await this.sendPacketRepository.createShippingPackage(request);
    }

    /**
     * Transform cart items to create shipping order with ShipThis
     * @param cartsForPayment list of cart items to be transformed to create the
     * shipping order
     */
    private transformProductsForShipping(cartsForPayment): Product[] | Cart[] {
        return cartsForPayment.map(i => ({
            hasInsurance: i.product.hasInsurance,
            fragile: i.product.fragile,
            quantity: parseInt(i.quantity),
            description: i.product.description,
            productDimension: i.product.productDimensions,
        }));
    }
}
