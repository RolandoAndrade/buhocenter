import { Module } from 'vuex';
import CategoryTypes from '@/store/categories/methods/categories.methods';
import categoriesHttpRepository from '@/modules/client/categories/repositories/categories.repository';
import categoriesFirebaseRepository from '@/modules/client/categories/repositories/categories.firebase';
import { CATEGORY_EMPTY_STATE } from './categories.state';
import { CategoryStateInterface } from './interfaces/categories.state.interface';
import { Categories, Category } from '@/modules/client/categories/interfaces/categories.interface';

const categoryModule: Module<CategoryStateInterface, any> = {
    namespaced: true,
    state: CATEGORY_EMPTY_STATE,
    getters: {
        [CategoryTypes.getters.GET_CATEGORIES](state): Category[] {
            return state.categories!;
        },
        [CategoryTypes.getters.GET_TOTAL_CATEGORIES](state): number {
            return state.totalCategories;
        },
        [CategoryTypes.getters.GET_CATEGORIES_AND_PHOTOS_LOADED](state): boolean {
            return state.categoriesAndPhotosLoaded;
        },
    },
    mutations: {
        [CategoryTypes.mutations.SET_CATEGORIES](state, response: Category[]): void {
            state.categories = response;
        },
        [CategoryTypes.mutations.SET_CATEGORIES_AND_PHOTOS_LOADED](state, value: boolean): void {
            state.categoriesAndPhotosLoaded = value;
        },
        [CategoryTypes.mutations.SET_TOTAL_CATEGORIES](state, total: number): void {
            state.totalCategories = total;
        },
        [CategoryTypes.mutations.SET_CATEGORIES_AND_PHOTOS_LOADED](state, loaded: boolean): void {
            state.categoriesAndPhotosLoaded = loaded;
        },
        [CategoryTypes.mutations.SET_CATEGORIES_AND_PHOTOS_LOADED_TOTAL](
            state,
            categories: Category[],
        ): void {
            state.categories = categories;
            state.categoriesAndPhotosLoaded = true;
        },
    },
    actions: {
        [CategoryTypes.actions.SET_CATEGORY_PHOTOS_NOT_LOADED]({ commit }, loaded: boolean): void {
            commit(CategoryTypes.mutations.SET_CATEGORIES_AND_PHOTOS_LOADED, loaded);
        },
        async [CategoryTypes.actions.FETCH_CATEGORIES]({ commit }): Promise<boolean> {
            try {
                const response: Categories = await categoriesHttpRepository.getCategories();
                commit(CategoryTypes.mutations.SET_CATEGORIES, response.categories);
                commit(
                    CategoryTypes.mutations.SET_TOTAL_CATEGORIES,
                    // eslint-disable-next-line
                    // @ts-ignore
                    response.categories.length,
                );
                return true;
            } catch (e) {
                return false;
            }
        },
        async [CategoryTypes.actions.FETCH_ALL_CATEGORIES]({ commit }): Promise<boolean> {
            try {
                const response: Category[] = await categoriesHttpRepository.getAllCategories();
                commit(CategoryTypes.mutations.SET_CATEGORIES, response);
                commit(
                    CategoryTypes.mutations.SET_TOTAL_CATEGORIES,
                    // eslint-disable-next-line
                    // @ts-ignore
                    response.length,
                );
                return true;
            } catch (e) {
                return false;
            }
        },
    },
};

export default categoryModule;
