import { Module } from 'vuex/types';
import OffersTypes from '@/store/offers/methods/offers.methods';
import OffersRepository from '@/modules/management/promotions/repositories/offers.repository';
import { Offers } from '@/modules/management/promotions/interfaces/offers.interface';
import { Offer } from '@/modules/management/promotions/interfaces/offer.interface';
import { OffersStateInterface } from './interfaces/offers.state.interface';
import { OFFERS_EMPTY_STATE } from './offers.state';
import offersRepository from '@/modules/management/promotions/repositories/offers.repository';

const offers: Module<OffersStateInterface, any> = {
    namespaced: true,
    state: OFFERS_EMPTY_STATE,
    getters: {
        [OffersTypes.getters.GET_OFFERS](state): Offer[] {
            return state.offers;
        },
        [OffersTypes.getters.GET_QUANTITY](state): number {
            return state.quantity;
        },
    },
    mutations: {
        [OffersTypes.mutations.SET_OFFERS](state, offers: Offer[]): void {
            state.offers = offers;
        },
        [OffersTypes.mutations.SET_QUANTITY](state, quantity: number): void {
            state.quantity = quantity;
        },
    },
    actions: {
        async [OffersTypes.actions.CREATE_OFFER]({ commit }, offer: Offer): Promise<boolean> {
            try {
                await offersRepository.createOffer(offer);
                return true;
            } catch (e) {
                return false;
            }
        },
        async [OffersTypes.actions.FETCH_OFFERS](
            { commit },
            payload: { start: number; limit: number },
        ): Promise<boolean> {
            try {
                const response: Offers = await OffersRepository.getOffers(payload.start, payload.limit);
                commit(OffersTypes.mutations.SET_OFFERS, response.offers);
                commit(OffersTypes.mutations.SET_QUANTITY, response.quantity);
                return true;
            } catch (e) {
                return false;
            }
        },
        async [OffersTypes.actions.DELETE_OFFERS]({ commit }, offerId: number): Promise<boolean> {
            try {
                await offersRepository.deleteOffer(offerId);
                return true;
            } catch (e) {
                return false;
            }
        },
    },
};

export default offers;
