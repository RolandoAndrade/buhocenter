import { HttpRepository } from '@/http/http.repository';
import { Offer } from '../interfaces/offer.interface';
import { Offers } from '../interfaces/offers.interface';

class OffersRepository extends HttpRepository {
    private static readonly RESOURCE = 'offers';

    async getOffers(start: number, limit: number): Promise<Offers> {
        return await this.get(
            this.createUri([`${OffersRepository.RESOURCE}`, `${start}`, `${limit}`]),
            this.createHeader(),
        );
    }

    deleteOffer(offerId: number): Promise<boolean> {
        return this.delete(
            this.createUri([`${OffersRepository.RESOURCE}`, `${offerId}`]),
            this.createHeader(),
        );
    }

    createOffer(offer: Offer): Promise<boolean> {
        return this.post(this.createUri([`${OffersRepository.RESOURCE}`]), offer, this.createHeader());
    }
}

export default new OffersRepository();
