import {
    Controller,
    Inject,
    Get,
    Res,
    Param,
    ParseIntPipe,
    HttpStatus,
    Post,
    Body,
    HttpCode,
    Query,
} from '@nestjs/common';
import { Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PaymentsService } from '../services/payments.service';
import { NewPayment } from '../interfaces/new-payment';
import { Checkout } from '../interfaces/checkout';
import { OrderStatus } from '../interfaces/order-status';
import { Payment } from '../entities/payment.entity';
import { PaginatedPayments } from '../interfaces/paginated-payments';
import { PaymentParameters } from '../interfaces/payment-parameters';

@Controller('payments')
export class PaymentsController {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        private readonly paymentsService: PaymentsService,
    ) {}

    @Post('/orders')
    createOrder(@Body() checkout: Checkout): Promise<NewPayment> {
        this.logger.info(`createOrder: Creating a new order`, {
            context: PaymentsController.name,
        });

        return this.paymentsService.createOrder(checkout);
    }

    @HttpCode(200)
    @Post('/orders/callback')
    callbackOrders(@Body() order: OrderStatus): Promise<OrderStatus> {
        this.logger.info(`callbackOrders: receiving the status of a payment`, {
            context: PaymentsController.name,
        });

        return this.paymentsService.callbackOrders(order);
    }

    @Get()
    getPayments(@Query() parameters: PaymentParameters): Promise<Payment[] | PaginatedPayments> {
        this.logger.info('getPayments: Getting the payments', {
            context: PaymentsController.name,
        });

        return this.paymentsService.getPayments(parameters);
    }

    @Get(':id')
    getPaymentsById(@Param('id', new ParseIntPipe()) id: number): Promise<Payment> {
        this.logger.info('getPaymentsByUserI: Getting a payment by its id', {
            context: PaymentsController.name,
        });

        return this.paymentsService.getPaymentsById(id);
    }
}
