import { Module } from 'vuex';
import BrandsTypes from './methods/brands.methods';
import BrandsHttpRepository from '@/modules/client/brand/brands.repository';
import { BrandsStateInterface } from './interfaces/brands.state.interface';
import { BRANDS_EMPTY_STATE } from './brands.state';
import { BrandInterface } from '../../modules/client/brand/interfaces/brand.interface';

const brands: Module<BrandsStateInterface, any> = {
    namespaced: true,
    state: BRANDS_EMPTY_STATE,
    getters: {
        [BrandsTypes.getters.GET_BRANDS](state) {
            return state.brands;
        },
    },
    mutations: {
        [BrandsTypes.mutations.GET_BRANDS_SUCCESS](state, data: BrandInterface[]) {
            state.brands = data;
        },
    },
    actions: {
        async [BrandsTypes.actions.FETCH_BRANDS]({ commit }): Promise<boolean> {
            try {
                const response: BrandInterface[] = await BrandsHttpRepository.getBrands();
                commit(BrandsTypes.mutations.GET_BRANDS_SUCCESS, response);
                return false;
            } catch (e) {
                return true;
            }
        },
    },
};

export default brands;
