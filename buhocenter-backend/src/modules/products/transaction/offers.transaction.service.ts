import { Injectable, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { InjectConnection } from '@nestjs/typeorm';
import { Logger } from 'winston';
import { Connection } from 'typeorm';

import { OffersService } from '../services/offers.service';
import { OfferDto, OfferAssignProductDto } from '../dto/offers.dto';
import { Offer } from '../entities/offer.entity';

@Injectable()
export class OffersTransactionsRepository {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        @InjectConnection() private readonly connection: Connection,
        private readonly offersService: OffersService,
    ) {}

    public async createOffer(data: OfferDto): Promise<any> {
        this.logger.debug(`createOffer: starting process to create a new offer`, {
            context: OffersTransactionsRepository.name,
        });

        return await this.connection.transaction(async transactionalEntityManager => {
            return await this.offersService.createOffer(data, transactionalEntityManager);
        });
    }

    public async deleteOffer(offerId: number): Promise<any> {
        this.logger.debug(`deleteOffer: starting process to delete the offer with id [id=${offerId}]`, {
            context: OffersTransactionsRepository.name,
        });

        return await this.connection.transaction(async transactionalEntityManager => {
            return await this.offersService.deleteOffer(offerId, transactionalEntityManager);
        });
    }
}
