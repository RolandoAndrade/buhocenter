import { Repository, EntityManager } from 'typeorm';
import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Offer } from '../entities/offer.entity';
import { StatusService } from '../../status/services/status.service';
import { STATUS } from '../../../config/constants';
import { OfferDto } from '../dto/offers.dto';
import { OffersRO } from '../interfaces/offers';

@Injectable()
export class OffersService {
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
        @InjectRepository(Offer)
        private readonly OfferRepository: Repository<Offer>,
        @Inject(StatusService)
        private readonly statusService: StatusService,
    ) {}

    public async getOffers(start: number, limit: number): Promise<OffersRO> {
        try {
            let offersGot: Offer[], quantity;
            [offersGot, quantity] = await this.OfferRepository.findAndCount({
                where: { status: STATUS.ACTIVE.id },
                skip: start,
                take: limit,
            });
            let offersRo: OffersRO = {
                offers: offersGot,
                quantity: quantity,
            };

            return offersRo;
        } catch (e) {
            this.logger.error(
                `getOffers: error when trying to get all available offers [error=${e.message}]`,
            );
        }
    }

    public async createOffer(
        offerDescriptions: OfferDto,
        transactionalEntityManager: EntityManager,
    ): Promise<Offer> {
        try {
            let active = await this.statusService.getStatusById(STATUS.ACTIVE.id);

            let newOffer: Offer = new Offer();
            newOffer.name = offerDescriptions.name;
            newOffer.description = offerDescriptions.description;
            newOffer.percentage = offerDescriptions.percentage;
            newOffer.status = active;

            await transactionalEntityManager.getRepository(Offer);
            await transactionalEntityManager.save(newOffer);

            return newOffer;
        } catch (e) {
            this.logger.error(
                `createOffer: error when trying to create the offer [error=${JSON.stringify(e.message)}]`,
            );
        }
    }

    public async deleteOffer(offerId: number, transactionalEntityManager: EntityManager): Promise<boolean> {
        try {
            let OfferRepository: Repository<Offer> = await transactionalEntityManager.getRepository(Offer);
            await OfferRepository.update({ id: offerId }, { status: { id: STATUS.INACTIVE.id } });

            return true;
        } catch (e) {
            this.logger.error(
                `deleteOffer: error when trying to delete the offer [id=${offerId}| error =${e.message}]`,
            );

            return false;
        }
    }
}
