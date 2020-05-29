import { Module } from 'vuex';
import { 
    FETCH_CATEGORIES 
} from './methods/categories.actions';
import { 
    GET_CATEGORIES_SUCCESS 
} from './methods/categories.mutations';
import { 
    GET_CATEGORIES 
} from './methods/categories.getters';

import CategoriesHttpRepository from '@/modules/products/http-repositories/categories-http.repository';

const categories: Module<any, any> = {
    namespaced: true,
    state: {
        categories: [],
        err_Categories: false,
    },
    getters: {
        [GET_CATEGORIES](state){
            return state.categories;
        },
    },
    mutations: {
        [GET_CATEGORIES_SUCCESS](state, data) {
            // @ts-ignore
            state.categories = data.categories;
        },
    },
    actions: {
        async [FETCH_CATEGORIES]({ commit }): Promise <boolean | any>{  
            try{          
                const response = await CategoriesHttpRepository.getCategories();
                commit(GET_CATEGORIES_SUCCESS, response);
                return false;   
            }catch(e){
                return true;
            }
        },
    },
};

export default categories;
