import { Module } from 'vuex';
import LayoutTypes from '@/store/layout/methods/layout.methods';
import { Catalogue } from '@/modules/client/catalogues/interfaces/catalogues.interface';
import { Category } from '@/modules/client/categories/interfaces/categories.interface';
import { LAYOUT_EMPTY_STATE } from '@/store/layout/layout.state';

const layout: Module<any, any> = {
    namespaced: true,
    state: LAYOUT_EMPTY_STATE,
    getters: {
        [LayoutTypes.getters.GET_CATEGORY](state): string {
            return state.category.term;
        },
        [LayoutTypes.getters.GET_CATALOGUE](state): string {
            return state.catalogue.term;
        },
        [LayoutTypes.getters.GET_CATEGORY_ID](state): number {
            return state.category.id;
        },
        [LayoutTypes.getters.GET_CATALOGUE_ID](state): number {
            return state.catalogue.id;
        },
    },
    mutations: {
        [LayoutTypes.mutations.SET_CATEGORY](state, category: Category): void {
            state.category = category;
        },
        [LayoutTypes.mutations.SET_CATALOGUE](state, catalogue: Catalogue): void {
            state.catalogue = catalogue;
        },
    },
    actions: {
        [LayoutTypes.actions.MODIFY_CATEGORY]({ commit }, category: Category): void {
            commit(LayoutTypes.mutations.SET_CATEGORY, category);
        },
        [LayoutTypes.actions.MODIFY_CATALOGUE]({ commit }, catalogue: Catalogue): void {
            commit(LayoutTypes.mutations.SET_CATALOGUE, catalogue);
        },
    },
};

export default layout;
