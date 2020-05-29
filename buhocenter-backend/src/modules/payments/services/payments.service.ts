import { Injectable, Inject } from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { EntityManager, Repository } from 'typeorm';
import { PaymentGatewayRepository } from '../repositories/payment-gateway.repository';
import { ProductsService } from '../../products/services/products.service';
import { PlatformManagementService } from '../../platform-management/services/platform-management.service';
import { CheckoutsService } from './checkouts.service';
import { ITEM_TYPE, UTRUST_PAYMENT_STATUS, PLATFORM_PARAMETERS } from '../../../config/constants';
import { Checkout } from '../entities/checkout.entity';
import { Payment } from '../entities/payment.entity';
import { PaymentOrderDto } from '../dto/payments.dto';
import { Product } from '../../products/entities/product.entity';
import { StatusService } from '../../status/services/status.service';
import { STATUS } from '../../../config/constants';
import { Platform } from '../../platform-management/entities/platform.entity';
import { StatusHistory } from '../../status/entities/status-history.entity';
import { CartsService } from '../../carts/services/carts.service';
import { Cart } from '../../carts/entities/cart.entity';

@Injectable()
export class PaymentsService {
    constructor (
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private readonly paymentGatewayRepository: PaymentGatewayRepository,
        private readonly productsService: ProductsService,
        private readonly platformManagementService: PlatformManagementService,
        private readonly checkoutsService: CheckoutsService,
        private readonly statusService: StatusService,
        private readonly cartsService: CartsService,
    ) {}

    public async createPayment(paymentOrder, transactionalEntityManager: EntityManager): Promise<Payment> {
        this.logger.debug(`createPayment: creando el pago [checkoutId=${paymentOrder.resource.reference}]`,
            { context: PaymentsService.name });
        
        const payment = {
            total: parseFloat(paymentOrder.resource.amount),
            checkout: {
                id: parseInt(paymentOrder.resource.reference),
            },
        }

        const paymentsTransactionRepository: Repository<Payment> = transactionalEntityManager.getRepository(
            Payment,
        );

        return paymentsTransactionRepository.save(payment);
    }

    public async validateItemsAvailability(order, checkoutId: number, transactionalEntityManager: EntityManager): Promise<boolean> {

        for await (const item of order.items) {
            let itemAvailability: number;
            let minInventoryAvailability: number;
            
            if (item.type.id === ITEM_TYPE.PRODUCT) {
                minInventoryAvailability = 
                    (await this.productsService.getMinimumProductAvailable(item.sku)).minimumQuantityAvailable;

                itemAvailability = (await this.productsService.getProductInventoryAvailability(item.sku)).availableQuantity;

                this.logger.debug(`validateItemsAvailability: [minInventoryAvailability=${
                    minInventoryAvailability}|itemAvailability=${itemAvailability}]`, { context: PaymentsService.name });

                if (order.cart) {
                    await this.cartsService.updateProductCartCheckout(order.cart.id, item.sku, checkoutId, transactionalEntityManager);
                } else {
                    const productCart = {
                        quantity: item.quantity,
                        product: {
                            id: item.sku,
                        },
                        customer: {
                            id: order.customer.id,
                        }
                    }

                    const cart: Cart = await this.cartsService.asociateProductCart(productCart);

                    await this.cartsService.updateProductCartCheckout(cart.id, item.sku, checkoutId, transactionalEntityManager);
                }

                if ((minInventoryAvailability < itemAvailability) && (item.quantity < itemAvailability)) {
                    await this.productsService.updateProductInventory(
                        this.createProductInventoryEntity(itemAvailability - item.quantity, checkoutId, item.sku, STATUS.RESERVED.id),
                        transactionalEntityManager,
                    )
                    delete item['type'];
                } else {
                    return false;
                }
            }
        }

        return true;
    }

    private createProductInventoryEntity(availableQuantity: number, checkoutId: number, productId: number, statusId: number) {
        return {
            availableQuantity,
            checkout: {
                id: checkoutId,
            },
            product: {
                id: productId
            },
            status: {
                id: statusId,
            }
        }
    }

    /**
     * Creates the order object to proceed with checkout process
     * @param order 
     * @param checkoutId 
     */
    private async createOrderObject(order, checkoutId: number) {
        const checkout = {
            id: checkoutId,
            amount: order.amount,
            line_items: order.items,
            customer: order.customer,
        }

        const paymentCommission: Platform =
            await this.platformManagementService.getPlatformParameterValue(PLATFORM_PARAMETERS.PAYMENT_COMMISSION.id);
        const ecommerceServiceCommission: Platform =
            await this.platformManagementService.getPlatformParameterValue(PLATFORM_PARAMETERS.ECOMMERCE_SERVICE_COMMISSION.id);
        const tax: number = parseFloat(paymentCommission.content) +
            (parseFloat(ecommerceServiceCommission.content) * parseFloat(checkout.amount.total) / 100);
        
        checkout.amount.total = `${parseFloat(checkout.amount.total) + tax}`;
        checkout.amount.details.tax = `${tax}`;
        
        // console.log('checkout', checkout);

        return checkout;
    }

    private createCheckoutEntity(order) {
        let checkout: { currency: { id: number }; cart?: { id: number } } = {
            currency: {
                id: order.currency.id
            }
        };

        if (order.cart) {
            checkout.cart = {
                id: order.cart.id,
            }
        }

        return checkout;
    }

    private creatstatusHistoryEntity(checkoutId, statusId) {
        return {
            checkout: {
                id: checkoutId
            },
            status: {
                id: statusId
            }
        }
    }

    /**
     * Creates the order to checkout, updates the status history of the order and checks if the products
     * are available in inventory
     * @param order entity which represents the order to checkout
     * @param transactionalEntityManager 
     */
    public async createOrder(order, transactionalEntityManager: EntityManager): Promise<string> {
        this.logger.debug(`createOrder: executing payment [order=${JSON.stringify(order)}]`, { context: PaymentsService.name });
        
        const checkout: Checkout =
            await this.checkoutsService.createCheckout(this.createCheckoutEntity(order), transactionalEntityManager);

        const canStartCheckout: boolean = await this.validateItemsAvailability(order, checkout.id, transactionalEntityManager);

        if (!canStartCheckout) {
            throw new Error('This product is not available.');
        }

        await this.statusService.creatstatusHistory(
            this.creatstatusHistoryEntity(checkout.id, STATUS.TO_PROCESS.id), transactionalEntityManager
        );
            
        const orderObj = await this.createOrderObject(order, checkout.id);
        const paymentOrder = await this.paymentGatewayRepository.createOrder(orderObj);

        this.logger.debug(`paymentOrder [paymentOrder=${JSON.stringify(paymentOrder)}]`);

        await this.checkoutsService.
            updateCheckoutWithTransactionIdByCheckoutId(checkout.id, paymentOrder.data.id, transactionalEntityManager);

        return paymentOrder.data.attributes.redirect_url;
    }

    /**
     * Updates the checkout created according to the payment gateway
     * @param paymentOrder object sent by UTRUST notifying the payment status
     * @param transactionalEntityManager transactional entity manager
     */
    public async updateOrder(paymentOrder: PaymentOrderDto, transactionalEntityManager: EntityManager): Promise<void> {
        this.logger.debug(`updateOrder: modifying the order [order=${JSON.stringify(paymentOrder)}]`,
            { context: PaymentsService.name });

        if (paymentOrder.event_type === UTRUST_PAYMENT_STATUS.CONFIRMED.text) {
            this.logger.debug(`updateOrder: order approved! [eventType=${
                paymentOrder.event_type}|orderId=${paymentOrder.resource.reference}]`, { context: PaymentsService.name });

            this.logger.debug(`${paymentOrder.event_type} - ${paymentOrder.resource.reference}`);
            
            await this.createPayment(paymentOrder, transactionalEntityManager);
            
            const lastStatusHistory: StatusHistory = await this.statusService.getStatusHistoryByCheckoutIdAndStatusId(
                parseInt(paymentOrder.resource.reference), STATUS.PROCESSED.id);

            await this.productsService.updateProductInventoryWithCheckout(
                parseInt(paymentOrder.resource.reference), STATUS.PROCESSED.id, transactionalEntityManager
            );

            if (!lastStatusHistory) {
                await this.statusService.creatstatusHistory(
                    this.creatstatusHistoryEntity(paymentOrder.resource.reference, STATUS.PROCESSED.id), transactionalEntityManager
                );
            }

		} else {
            this.logger.error(`updateOrder: order cancelled! [eventType=${
                paymentOrder.event_type}|orderId=${paymentOrder.resource.reference}]`, { context: PaymentsService.name });
            
            const lastStatusHistory: StatusHistory = await this.statusService.getStatusHistoryByCheckoutIdAndStatusId(
                parseInt(paymentOrder.resource.reference), STATUS.REJECTED.id);

            if (!lastStatusHistory) {
                await this.statusService.creatstatusHistory(
                    this.creatstatusHistoryEntity(paymentOrder.resource.reference, STATUS.REJECTED.id), transactionalEntityManager
                );
            }
            
            await this.productsService.updateProductInventoryWithCheckout(
                parseInt(paymentOrder.resource.reference), STATUS.REJECTED.id, transactionalEntityManager
            );

        }
    }
}
