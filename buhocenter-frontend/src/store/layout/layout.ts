import { Module } from 'vuex';
import {
    SET_CATALOGUE,
    SET_CATEGORY,
} from './methods/layout.mutations';
import {
    MODIFY_CATALOGUE,
    MODIFY_CATEGORY,
} from './methods/layout.actions';
import {
    GET_CATALOGUE,
    GET_CATEGORY,
    GET_CATEGORY_ID,
    GET_CATALOGUE_ID,
} from './methods/layout.getters';
import Catalogue from './models/Catalogue';
import Category from './models/Category';

const layout: Module<any, any> = {
    namespaced: true,
    state: {
        catalogue: {},
        category: {},
    },
    getters: {
        [GET_CATEGORY](state): string {
            return state.category.term;
        },
        [GET_CATALOGUE](state): string {
            return state.catalogue.term;
        },
        [GET_CATEGORY_ID](state): number {
            return state.category.id;
        },
        [GET_CATALOGUE_ID](state): number {
            return state.catalogue.id;
        },
    },
    mutations: {
        [SET_CATEGORY](state, category: string): void {
            state.category = category;
        },
        [SET_CATALOGUE](state, catalogue: string): void {
            state.catalogue = catalogue;
        },
    },
    actions: {
        [MODIFY_CATEGORY]({ commit }, category: Category): void {
            commit(SET_CATEGORY, category);
        },
        [MODIFY_CATALOGUE]({ commit }, catalogue: Catalogue): void {
            commit(SET_CATALOGUE, catalogue);
        },
    },
}

export default layout;