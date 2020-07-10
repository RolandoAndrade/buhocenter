import { Module } from 'vuex/types';
import ThirdPartyTypes from '@/store/third-party/methods/third-party.methods';
import ThirdPartyRepository from '@/modules/third-party/repositories/petromilesAuth.repository';
import CustomerRepository from '@/modules/client/customers/repositories/customers.repository';
import { ThirdPartyStateInterface } from './interfaces/third-party.state.interface';
import { THIRD_PARTY_EMPTY_STATE } from './third-party.state';
import { PetromilesAuth } from '@/modules/third-party/interfaces/petromilesAuth.interface';

const offers: Module<ThirdPartyStateInterface, any> = {
    namespaced: true,
    state: THIRD_PARTY_EMPTY_STATE,
    getters: {},
    mutations: {},
    actions: {
        async [ThirdPartyTypes.actions.FETCH_AUTHORIZE](
            { commit },
            petromiles: PetromilesAuth,
        ): Promise<boolean> {
            try {
                await ThirdPartyRepository.authorize(petromiles);
                return true;
            } catch (e) {
                return false;
            }
        },
        async [ThirdPartyTypes.actions.FETCH_AUTHORIZE_CODE](
            { commit },
            petromiles: PetromilesAuth,
        ): Promise<boolean> {
            try {
                await ThirdPartyRepository.authorizeCode(petromiles);
                return true;
            } catch (e) {
                return false;
            }
        },
        async [ThirdPartyTypes.actions.VERFIFY_USER](
            { commit },
            petromiles: PetromilesAuth,
        ): Promise<boolean> {
            try {
                return !((await ThirdPartyRepository.verifyUser(petromiles)) === false);
            } catch (e) {
                return false;
            }
        },
        async [ThirdPartyTypes.actions.UNLINK_USER](
            { commit },
            petromiles: {
                id: number;
                fidelityUserEmail: null;
                loyaltySystemToken: null;
            },
        ): Promise<boolean> {
            try {
                await CustomerRepository.updateCustomer(petromiles);
                return true;
            } catch (e) {
                return false;
            }
        },
        async [ThirdPartyTypes.actions.GENERATE_CSV]({ commit }): Promise<boolean> {
            try {
                return await ThirdPartyRepository.generateCsv();
            } catch (e) {
                return false;
            }
        },
    },
};

export default offers;
