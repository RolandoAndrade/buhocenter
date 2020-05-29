import { Module } from 'vuex';
import {
    FETCH_PROVIDERS
} from './methods/providers.actions';
import {
    GET_PROVIDERS_SUCCESS
} from './methods/providers.mutations';
import {
    GET_PROVIDERS
} from './methods/providers.getters';

import ProvidersHttpRepository from '@/modules/products/http-repositories/providers-http.repository';

const Providers: Module<any, any> = {
    namespaced: true,
    state: {
        Providers: [],
        err_Providers: false,
    },
    getters: {
        [GET_PROVIDERS](state){
            return state.Providers;
        },
    },
    mutations: {
        [GET_PROVIDERS_SUCCESS](state, data) {
            // @ts-ignore
            state.Providers = data;
        },
    },
    actions: {
        async [FETCH_PROVIDERS]({ commit }): Promise <boolean | any>{  
            try{          
                const response = await ProvidersHttpRepository.getProviders();
                commit(GET_PROVIDERS_SUCCESS, response);
                return false;   
            }catch(e){
                return true;
            }
        },
    },
};

export default Providers;
