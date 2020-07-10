import { Module } from 'vuex';
import LoaderTypes from '@/store/loader/methods/loader.methods';
import { LOADER_EMPTY_STATE } from './loader.state';
import { LoaderStateInterface } from './interfaces/loader.state.interface';

const loader: Module<LoaderStateInterface, any> = {
    namespaced: true,
    state: LOADER_EMPTY_STATE,
    getters: {
        [LoaderTypes.getters.IS_LOADING](state): boolean {
            return state.loading;
        },
    },
    mutations: {
        [LoaderTypes.mutations.SET_LOADING](state, loading: boolean): void {
            state.loading = loading;
        },
    },
    actions: {
        [LoaderTypes.actions.SHOW_LOADER]({ commit }, loading: boolean): void {
            commit(LoaderTypes.mutations.SET_LOADING, loading);
        },
    },
};

export default loader;
