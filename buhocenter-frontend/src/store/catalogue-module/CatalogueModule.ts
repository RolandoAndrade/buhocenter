import { Module } from 'vuex';
import CatalogueTypes from '@/store/catalogue-module/methods/catalogue-methods';
import catalogueHttpRepository from '@/modules/products/http-repositories/catalogues-http.repository';

const catalogueModule: Module<any, any> = {
    namespaced: true,
    state: {
        catalogues: [],
        err_catalogues: false,
        fetched_catalogues: false,
    },
    getters: {
        [CatalogueTypes.getters.GET_CATALOGUES](state) {
            return state.catalogues;
        },
        [CatalogueTypes.getters.GET_ERR_CATALOGUE](state) {
            return state.err_catalogues;
        },
        [CatalogueTypes.getters.GET_FETCHED_CATALOGUE](state) {
            return state.fetched_catalogues;
        },
    },
    mutations: {
        [CatalogueTypes.mutations.SET_CATALOGUES](state, response): void {
            state.catalogues = response.catalogues;
            state.err_catalogues = false;
        },
        [CatalogueTypes.mutations.SET_ERR_CATALOGUE](state ): void {
            state.err_catalogues = true;
        },
    },
    actions: {
        async [CatalogueTypes.actions.FETCH_CATALOGUES]({ commit }, categoryId: string): Promise<boolean> {
            try {
                const response: any = await catalogueHttpRepository.getCataloguesByCategory(categoryId);
                commit(CatalogueTypes.mutations.SET_CATALOGUES, response);
                return true;
            } catch (e) {
                commit(CatalogueTypes.mutations.SET_ERR_CATALOGUE);
                return false;
            }
        },
        async [CatalogueTypes.actions.FETCH_ALL_CATALOGUES]({commit}): Promise<boolean>{
            try {
                const response: any = await catalogueHttpRepository.getAllCatalogues();
                commit(CatalogueTypes.mutations.SET_CATALOGUES, response);
                return false;
            } catch (e) {
                commit(CatalogueTypes.mutations.SET_ERR_CATALOGUE);
                return true;
            }
        },
        async [CatalogueTypes.actions.SAVE_CATALOGUE]({commit}, data): Promise<boolean>{
            try {
                const response: any = await catalogueHttpRepository.saveCatalogue(data);                
                return true;
            } catch (e) {                
                return false;
            }
        }
    },
};

export default catalogueModule;
