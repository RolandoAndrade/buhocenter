import { Module } from "vuex";
import { IS_LOADING } from './methods/loader.getters';
import { SET_LOADING } from './methods/loader.mutations';
import { SHOW_LOADER } from './methods/loader.actions';

const loader: Module<any, any> = {
    namespaced: true,
    state: {
        loading: false,
    },
    getters: {
        [IS_LOADING](state): boolean {
            return state.loading;
        },
    },
    mutations: {
        [SET_LOADING](state, loading: boolean): void {
            state.loading = loading;
        },
    },
    actions: {
        [SHOW_LOADER]({ commit }, loading: boolean): void {
            commit(SET_LOADING, loading);
        },
    },
};

export default loader;