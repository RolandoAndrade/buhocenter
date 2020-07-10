import { Offer } from '../entities/offer.entity';

export interface OffersRO {
    offers: Offer[];
    quantity: number;
}
