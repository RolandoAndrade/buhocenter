import { Injectable, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Checkout } from '../entities/checkout.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, UpdateResult } from 'typeorm';

@Injectable()
export class CheckoutsService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        @InjectRepository(Checkout)
        private readonly checkoutsRepository: Repository<Checkout>,
    ) {}

    /**
     * Permite registrar el checkout en la base de datos
     * @param checkout entidad que representa el checkout o la orden de compra
     * @returns Promise<Checkout>
     */
    public async createCheckout(checkout, transactionalEntityManager: EntityManager): Promise<Checkout> {
        this.logger.debug(`createCheckout [checkout=${JSON.stringify(checkout)}]`, { context: CheckoutsService.name });

        const checkoutTransactionRepository: Repository<Checkout> = transactionalEntityManager.getRepository(
            Checkout,
        );

        return this.checkoutsRepository.save(checkout);
    }

    public async updateCheckoutWithTransactionIdByCheckoutId(
        checkoutId: number,
        transactionId: string,
        transactionalEntityManager: EntityManager
    ): Promise<Checkout> {
        this.logger.debug(`updateCheckoutWithTransactionId [transactionId=${
            transactionId}|checkoutId=${checkoutId}]`, { context: CheckoutsService.name });

        const checkoutTransactionRepository: Repository<Checkout> = transactionalEntityManager.getRepository(
            Checkout,
        );

        return checkoutTransactionRepository.query(`UPDATE checkout set transaction_id = '${transactionId}' WHERE id = ${checkoutId}; COMMIT`);
    }

    /**
     * Obtiene el checkout dado un id
     * @param checkoutId id del checkout
     */
    public async getCheckoutById(checkoutId: string): Promise<Checkout> {
        this.logger.debug(`updateCheckoutWithTransactionId [checkoutId=${checkoutId}]`, { context: CheckoutsService.name });

        return this.checkoutsRepository.findOne({
            where: { id: checkoutId },
            relations: [
                'cart',
            ],
        })
    }
}
