import { Module } from 'vuex';
import CatalogueTypes from '@/store/catalogue/methods/catalogue.methods';
import catalogueHttpRepository from '@/modules/client/catalogues/repositories/catalogues.repository';
import { CatalogueStateInterface } from './interfaces/catelogue.state.interface';
import { CATALOGUE_EMPTY_STATE } from './catalogue.state';
import {
    Catalogues,
    Catalogue,
    ProductCatalogue,
} from '@/modules/client/catalogues/interfaces/catalogues.interface';
import { CatalogueCreateI } from '@/modules/management/catalogues/components/interfaces/catalogue.create';

const catalogueModule: Module<CatalogueStateInterface, any> = {
    namespaced: true,
    state: CATALOGUE_EMPTY_STATE,
    getters: {
        [CatalogueTypes.getters.GET_CATALOGUES](state): Catalogue[] {
            return state.catalogues;
        },
        [CatalogueTypes.getters.GET_ERR_CATALOGUE](state): boolean {
            return state.err_catalogues;
        },
        [CatalogueTypes.getters.GET_FETCHED_CATALOGUE](state): boolean {
            return state.fetched_catalogues;
        },
    },
    mutations: {
        [CatalogueTypes.mutations.SET_CATALOGUES](state, response: Catalogues): void {
            state.catalogues = response.catalogues;
            state.err_catalogues = false;
        },
        [CatalogueTypes.mutations.SET_ERR_CATALOGUE](state): void {
            state.err_catalogues = true;
        },
    },
    actions: {
        async [CatalogueTypes.actions.FETCH_CATALOGUES]({ commit }, categoryId: string): Promise<boolean> {
            try {
                const response: Catalogues = await catalogueHttpRepository.getCataloguesByCategory(
                    categoryId,
                );
                commit(CatalogueTypes.mutations.SET_CATALOGUES, response);
                return true;
            } catch (e) {
                commit(CatalogueTypes.mutations.SET_ERR_CATALOGUE);
                return false;
            }
        },
        async [CatalogueTypes.actions.FETCH_ALL_CATALOGUES]({ commit }): Promise<boolean> {
            try {
                const response: Catalogues = await catalogueHttpRepository.getAllCatalogues();
                commit(CatalogueTypes.mutations.SET_CATALOGUES, response);
                return false;
            } catch (e) {
                commit(CatalogueTypes.mutations.SET_ERR_CATALOGUE);
                return true;
            }
        },
        async [CatalogueTypes.actions.SAVE_CATALOGUE]({ commit }, data: ProductCatalogue): Promise<boolean> {
            try {
                const response: any = await catalogueHttpRepository.saveCatalogue(data);
                return true;
            } catch (e) {
                return false;
            }
        },
        async [CatalogueTypes.actions.CREATE_CATALOGUE](
            { commit },
            data: CatalogueCreateI,
        ): Promise<boolean> {
            try {
                const response: CatalogueCreateI = await catalogueHttpRepository.createCatalogue(data);
                return true;
            } catch (e) {
                return false;
            }
        },
        async [CatalogueTypes.actions.DELETE_CATALOGUE]({ commit }, catalogueId: number): Promise<any> {
            try {
                const response: any = await catalogueHttpRepository.deleteCatalogue(catalogueId);
                if (response === true) return true;
                else return false;
            } catch (e) {
                return false;
            }
        },
    },
};

export default catalogueModule;
