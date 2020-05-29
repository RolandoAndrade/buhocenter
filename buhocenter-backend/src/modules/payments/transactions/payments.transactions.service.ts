import { Injectable, Inject } from "@nestjs/common";
import { getManager, getConnection } from 'typeorm';
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { InjectConnection } from "@nestjs/typeorm";
import { Logger } from "winston";
import { Connection } from 'typeorm';
import { PaymentsService } from "../services/payments.service";
import { Checkout } from "../entities/checkout.entity";
import { PaymentOrderDto } from "../dto/payments.dto";

@Injectable()
export class PaymentsTransactionsRepository {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        @InjectConnection() private readonly connection: Connection,
        private readonly paymentsService: PaymentsService,
    ) {}

    /**
     * Inicia el bloque de la transacción para el proceso de checkout
     * @param order detalle de la orden para realizar el checkout
     * @returns Promise<void>
     */
    public async createOrder(order): Promise<string> {
        this.logger.debug(`createOrder: starting checkout process [order=${JSON.stringify(order)}]`);

        return await getManager().transaction(async transactionalEntityManager => {
            return this.paymentsService.createOrder(order, transactionalEntityManager);
        })
    }

    /**
     * Inicia el bloque de la transacción para el proceso de actualización de la orden
     * @param order detalle de la orden para realizar el checkout
     * @returns Promise<void>
     */
    public async updateOrder(order: PaymentOrderDto): Promise<void> {
        this.logger.debug(`updateOrder: starting checkout process [order=${JSON.stringify(order)}]`);

        return await getConnection().transaction(async transactionalEntityManager => {
            return this.paymentsService.updateOrder(order, transactionalEntityManager);
        })
    }
}