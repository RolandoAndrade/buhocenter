import { Offer } from '@/modules/management/promotions/interfaces/offer.interface';

export interface OffersStateInterface {
    offers: Offer[];
    quantity: number;
}
