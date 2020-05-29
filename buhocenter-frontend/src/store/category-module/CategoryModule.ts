import { Module } from 'vuex';
import CategoryTypes from '@/store/category-module/methods/category-methods';
import categoriesHttpRepository from '@/modules/products/http-repositories/categories-http.repository';
import categoriesFirebaseRepository from '@/modules/products/firebase-repositories/categories-firebase.repository';

const categoryModule: Module<any, any> = {
    namespaced: true,
    state: {
        categories: [],
        categoriesAndPhotosLoaded: false,
        totalCategories: 0,
    },
    getters: {
        [CategoryTypes.getters.GET_CATEGORIES](state) {
            return state.categories;
        },
        [CategoryTypes.getters.GET_TOTAL_CATEGORIES](state) {
            return state.totalCategories;
        },
        [CategoryTypes.getters.GET_CATEGORIES_AND_PHOTOS_LOADED](state) {
            return state.categoriesAndPhotosLoaded;
        },
    },
    mutations: {
        [CategoryTypes.mutations.SET_CATEGORIES](state, response): void {
            state.categories = response.categories;
        },
        [CategoryTypes.mutations.SET_CATEGORIES_AND_PHOTOS_LOADED](state, value: boolean ): void {
            state.categoriesAndPhotosLoaded = value;
        },
        [CategoryTypes.mutations.SET_TOTAL_CATEGORIES](state, total: number): void {
            state.totalCategories = total;
        },
        [CategoryTypes.mutations.SET_CATEGORIES_AND_PHOTOS_LOADED](state, loaded: boolean): void {
            state.categoriesAndPhotosLoaded = loaded;
        },
        [CategoryTypes.mutations.SET_CATEGORIES_AND_PHOTOS_LOADED_TOTAL](state, categories): void {
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
                const response = await categoriesHttpRepository.getCategories();
                commit(CategoryTypes.mutations.SET_CATEGORIES, response);
                // @ts-ignore
                commit(CategoryTypes.mutations.SET_TOTAL_CATEGORIES, response.categories.length);
                return true;
            } catch (e) {
                return false;
            }
        },
        async [CategoryTypes.actions.FETCH_CATEGORY_PHOTO_BY_NAME]({ commit }, categories ): Promise<boolean> {
            try {
                for (const category of categories) {
                    category.photo = await categoriesFirebaseRepository.getCategoryPhotoByName(category.photo);
                }
                commit(CategoryTypes.mutations.SET_CATEGORIES_AND_PHOTOS_LOADED_TOTAL, categories);
                return true;
            } catch (e) {
                return false;
            }
        },
    },
};

export default categoryModule;
