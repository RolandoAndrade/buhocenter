import { Module } from 'vuex';
import {
    FETCH_BRANDS
} from './methods/brands.actions';
import {
    GET_BRANDS_SUCCESS
} from './methods/brands.mutations';
import {
    GET_BRANDS
} from './methods/brands.getters';

import BrandsHttpRepository from '@/modules/products/http-repositories/brands-http.repository';

const brands: Module<any, any> = {
    namespaced: true,
    state: {
        brands: [],
        err_brands: false,
    },
    getters: {
        [GET_BRANDS](state){
            return state.brands;
        },
    },
    mutations: {
        [GET_BRANDS_SUCCESS](state, data) {
            // @ts-ignore
            state.brands = data;
        },
    },
    actions: {
        async [FETCH_BRANDS]({ commit }): Promise <boolean | any>{            
            try{
                const response = await BrandsHttpRepository.getBrands();
                commit(GET_BRANDS_SUCCESS, response);
                return false; 
            }catch(e){
                return true;
            }  
        },
    },
};

export default brands;
