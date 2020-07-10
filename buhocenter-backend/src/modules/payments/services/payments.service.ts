import { Injectable, Inject, HttpStatus, BadRequestException } from '@nestjs/common';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { IPaymentClient } from '../interfaces/payment-client';
import { CoingatePaymentStrategy } from '../strategies/coingate-payment.strategy';
import { ConfigService } from 'src/config/config.service';
import { Checkout } from '../interfaces/checkout';
import { NewPayment } from '../interfaces/new-payment';
import { StatusService } from 'src/modules/status/services/status.service';
import { STATUS, PAGINATE } from 'src/config/constants';
import { CartsService } from 'src/modules/carts/services/carts.service';
import { Payment } from '../entities/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager, Brackets } from 'typeorm';
import { CommissionsService } from './commissions.service';
import { StatusHistory } from 'src/modules/status/entities/status-history.entity';
import { NewOrder } from '../interfaces/new-order';
import { OrderStatus } from '../interfaces/order-status';
import { Status } from 'src/modules/status/entities/status.entity';
import { CryptocurrenciesService } from './cryptocurrencies.service';
import { ProductRatingsService } from 'src/modules/products/services/product-ratings.service';
import { UsersService } from 'src/modules/users/services/users.service';
import { CustomerLoyaltyService } from 'src/modules/third-party/services/customer-loyalty.service';
import { CustomerLoyaltyTickets } from 'src/modules/third-party/interfaces/customer-loyalty-tickets';
import { CustomerLoyaltyAccumulatePointsResponse } from 'src/modules/third-party/interfaces/customer-loyalty-accumulate-points';
import { PaymentParameters } from '../interfaces/payment-parameters';
import { PaginatedPayments } from '../interfaces/paginated-payments';
import { Cart } from 'src/modules/carts/entities/cart.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { SendPacketService } from '../../third-party/services/send-packet.service';

@Injectable()
export class PaymentsService {
    private paymentClient: IPaymentClient;

    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        @InjectRepository(Payment)
        private readonly paymentRepository: Repository<Payment>,
        private readonly cartService: CartsService,
        private readonly commissionService: CommissionsService,
        private readonly cryptocurrencyService: CryptocurrenciesService,
        private readonly statusService: StatusService,
        private readonly productRatingService: ProductRatingsService,
        private readonly usersService: UsersService,
        private readonly customerLoyaltyService: CustomerLoyaltyService,
        private readonly packageShippingService: SendPacketService,
        private readonly configService: ConfigService,
    ) {
        this.paymentClient = new CoingatePaymentStrategy(this.configService);
    }

    /**
     * createOrder
     * @param checkout: Checkout
     * @returns Promise<NewPayment>
     */
    async createOrder(checkout: Checkout): Promise<NewPayment> {
        this.logger.debug(`createOrder: Creating a new order`, {
            context: PaymentsService.name,
        });

        const price = this.cartService.getPriceForCarts(checkout.cartsForPayment);
        const activeCommission = await this.commissionService.getActiveCommission();
        const newOrderStatus = await this.statusService.getStatusById(STATUS.NEW.id);

        const user: User = await this.usersService.getUserByAddress(checkout.address.id);

        let payment: Payment = new Payment();

        let packageShippingOrder;

        this.logger.debug(`createOrder: Sending the order to Shipping System`, {
            context: PaymentsService.name,
        });
        packageShippingOrder = await this.packageShippingService.createShippingOrder(user, checkout);
        payment.trackingUrl = packageShippingOrder.tracking_URL;

        let cartsWithPoints: Cart[] = checkout.cartsForPayment.filter(cart => cart.productPoints > 0);

        if (user.loyaltySystemToken && cartsWithPoints.length > 0) {
            let response: CustomerLoyaltyAccumulatePointsResponse;
            this.logger.debug(`createOrder: Sending the order to Loyalty System`, {
                context: PaymentsService.name,
            });
            try {
                response = await this.customerLoyaltyService.accumulatePoints(
                    cartsWithPoints,
                    user.loyaltySystemToken,
                );
            } catch (error) {
                throw new BadRequestException(error);
            }

            const ticket = response.confirmationTicket;

            payment.loyaltySystemConfirmationId = ticket.confirmationId;
            payment.loyaltySystemDate = ticket.date.toString();
            payment.loyaltySystemAmount = ticket.pointsToDollars.toString();
            payment.loyaltySystemCommission = ticket.commission.toString();
            payment.loyaltySystemPoints = ticket.accumulatedPoints.toString();

            payment.total = parseFloat(
                (
                    price +
                    price * activeCommission.serviceFee +
                    price * activeCommission.processorFee +
                    ticket.commission / 100
                ).toFixed(2),
            );
        } else {
            payment.total = parseFloat(
                (price + price * activeCommission.serviceFee + price * activeCommission.processorFee).toFixed(
                    2,
                ),
            );
        }

        payment.address = checkout.address;
        payment.commission = activeCommission;
        payment.foreignExchange = checkout.foreignExchange;
        payment.carts = checkout.cartsForPayment;

        let statusHistory = new StatusHistory();
        statusHistory.status = newOrderStatus;
        payment.statusHistories = [statusHistory];

        let order: NewOrder;

        await getManager().transaction(async transactionEntityManager => {
            try {
                await this.cartService.reserveCarts(checkout.cartsForPayment, transactionEntityManager);
                const paymentTransactionRepository: Repository<Payment> = transactionEntityManager.getRepository(
                    Payment,
                );
                await paymentTransactionRepository.save(payment);
                this.logger.debug(`createOrder: Sending the order to payment gateway`, {
                    context: PaymentsService.name,
                });
                order = await this.paymentClient.createOrder(payment.id, payment.total);
                payment.transaction = order.id;
                await paymentTransactionRepository.save(payment);
            } catch (error) {
                throw error;
            }
        });

        return {
            payment: payment,
            order: order,
            packageOrder: packageShippingOrder,
        };
    }

    /**
     * callbackOrders
     * @param order: OrderStatus
     * @returns Promise<OrderStatus>
     */
    async callbackOrders(order: OrderStatus): Promise<OrderStatus> {
        this.logger.debug(`callbackOrders: Receiving the status of a payment [paymentId=${order.order_id}]`, {
            context: PaymentsService.name,
        });

        const payment = await this.getPaymentById(parseInt(order.order_id));
        const status = await this.statusService.getStatusByName(order.status);

        try {
            switch (order.status) {
                case STATUS.PENDING.name:
                    await this.setPaymentCryptocurrency(
                        payment,
                        parseFloat(order.pay_amount),
                        order.pay_currency,
                    );
                    break;
                case STATUS.PAID.name:
                    await this.cartService.payCarts(payment.carts, status);
                    break;
                case STATUS.INVALID.name:
                case STATUS.CANCELED.name:
                case STATUS.EXPIRED.name:
                    await this.cartService.giveBackCarts(payment.carts);
                    break;
            }
        } catch (error) {
            throw error;
        } finally {
            await this.updatePaymentStatus(payment, status);
            return order;
        }
    }

    /**
     * getPaymentById
     * @param paymentId: number
     * @returns Promise<Payment>
     */
    async getPaymentById(paymentId: number): Promise<Payment> {
        this.logger.debug(`getPaymentById: Getting a payment by id [paymentId=${paymentId}]`, {
            context: PaymentsService.name,
        });

        return await this.paymentRepository
            .createQueryBuilder('payment')
            .innerJoinAndSelect('payment.carts', 'carts')
            .innerJoinAndSelect('payment.statusHistories', 'statusHistories')
            .where('payment.id = :paymentId', { paymentId: paymentId })
            .getOne();
    }

    /**
     * updatePaymentStatus
     * @param payment: Payment
     * @param status: Status
     * @retuns void
     */
    async updatePaymentStatus(payment: Payment, status: Status) {
        this.logger.debug(
            `updatePaymentStatus: Updating de status of a payment [paymentId=${payment.id}|statusName=${status.name}]`,
            {
                context: PaymentsService.name,
            },
        );

        let statusHistory = new StatusHistory();
        statusHistory.status = status;
        payment.statusHistories.push(statusHistory);

        await this.paymentRepository.save(payment);
    }

    /**
     * setPaymentCryptocurrency
     * @param payment: Payment
     * @param totalCryptocurrency: number
     * @param cryptocurrencyIso: string
     * @returns void
     */
    async setPaymentCryptocurrency(payment: Payment, totalCryptocurrency: number, cryptocurrencyIso: string) {
        this.logger.debug(
            `setPaymentCryptocurrency: Setting cryptocurrency of a payment [paymentId=${payment.id}|cryptocurrencyIso=${cryptocurrencyIso}]`,
            {
                context: PaymentsService.name,
            },
        );

        const cryptocurrency = await this.cryptocurrencyService.getCryptotocurrencyByIso(cryptocurrencyIso);
        payment.totalCryptocurrency = totalCryptocurrency;
        payment.cryptocurrency = cryptocurrency;

        await this.paymentRepository.save(payment);
    }

    /**
     * getPayments
     * @param parameters: PaymentParameters
     * @returns Promise<Payment[] | PaginatedPayments>
     */
    async getPayments(parameters: PaymentParameters): Promise<Payment[] | PaginatedPayments> {
        this.logger.debug(
            `getPayments: Getting the payments [userId=${parameters.userId}|start=${parameters.start}|limit=${parameters.limit}]`,
            {
                context: PaymentsService.name,
            },
        );

        if (parameters.userId) {
            return await this.getPaymentsByUserId(parameters.userId);
        } else {
            parameters.start = parameters.start || PAGINATE.START;
            parameters.limit = parameters.limit || PAGINATE.LIMIT;
            return await this.getPaginatedPayments(parameters.start, parameters.limit);
        }
    }

    /**
     * getPaymentsByUserId
     * @param userId: number
     * @returns Payment[]
     */
    async getPaymentsByUserId(userId: number): Promise<Payment[]> {
        this.logger.debug(`getPaymentsByUserId: Getting the payments of a user [userId=${userId}]`, {
            context: PaymentsService.name,
        });

        let query = this.paymentRepository
            .createQueryBuilder('payment')
            .innerJoinAndSelect('payment.address', 'address')
            .innerJoinAndSelect('address.user', 'user')
            .innerJoinAndSelect('payment.statusHistories', 'statusHistories')
            .innerJoinAndSelect('statusHistories.status', 'status')
            .innerJoinAndSelect('payment.commission', 'commission')
            .innerJoinAndSelect('payment.foreignExchange', 'foreignExchange')
            .leftJoinAndSelect('payment.cryptocurrency', 'cryptocurrency');

        if (userId) {
            query.where('status.id <> :statusCanceledId', { statusCanceledId: STATUS.CANCELED.id });
            query.andWhere('status.id <> :statusExpiredId', { statusExpiredId: STATUS.EXPIRED.id });
            query.andWhere('status.id <> :statusInvalidId', { statusInvalidId: STATUS.INVALID.id });
            query.andWhere('user.id = :userId', { userId: userId });
        }

        return await query.getMany();
    }

    /**
     * getPaginatedPayments
     * @param start: number
     * @param limit: number
     * @returns Promise
     */
    async getPaginatedPayments(start: number, limit: number): Promise<PaginatedPayments> {
        this.logger.debug(
            `getPaginatedPayments: Getting paginated payments [start=${start}|limit=${limit}]`,
            {
                context: PaymentsService.name,
            },
        );

        start = start * limit - limit;

        const paginatedProducts = await this.paymentRepository.findAndCount({
            relations: [
                'address',
                'address.user',
                'commission',
                'statusHistories',
                'statusHistories.status',
                'foreignExchange',
                'cryptocurrency',
                'carts',
                'carts.product',
                'carts.product.productPhotos',
                'carts.product.brand',
                'carts.product.provider',
            ],
            skip: start,
            take: limit,
            order: {
                id: 'ASC',
            },
        });

        return {
            payments: paginatedProducts[0],
            paymentsNumber: paginatedProducts[1],
        };
    }

    /**
     * getPaymentsById
     * @param paymentId: number
     * @returns Paymen
     */
    async getPaymentsById(paymentId: number): Promise<Payment> {
        this.logger.debug(`getPaymentsById: Getting a payment by its id [paymentId=${paymentId}]`, {
            context: PaymentsService.name,
        });

        let payment = await this.paymentRepository.findOne({
            relations: [
                'address',
                'address.user',
                'commission',
                'statusHistories',
                'statusHistories.status',
                'foreignExchange',
                'cryptocurrency',
                'carts',
                'carts.product',
                'carts.product.productPhotos',
                'carts.product.brand',
                'carts.product.provider',
            ],
            where: { id: paymentId },
        });

        const userId = payment.address.user.id;

        const CartsNumber = Array.from({ length: payment.carts.length }, (array, index) => index);

        for await (let index of CartsNumber) {
            const productRating = await this.productRatingService.getProductRatingByUserIdAndProductId(
                userId,
                payment.carts[index].product.id,
            );
            if (productRating) {
                payment.carts[index].product.productRatings = [productRating];
            } else {
                payment.carts[index].product.productRatings = [];
            }
        }

        return payment;
    }
}
