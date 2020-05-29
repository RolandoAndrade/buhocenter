import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import baseModule from '@/store/base-module/BaseModule';
import carts from '@/store/carts/carts';
import products from '@/store/products/products';
import layout from '@/store/layout/layout';
import authModule from '@/store/auth-module/AuthModule';
import languageModule from '@/store/languages-module/LanguagesModule';
import brands from '@/store/brands/brands';
import providers from '@/store/providers/providers';
import payments from '@/store/payments/payments';
import loader from '@/store/loader/loader';
import categoryModule from '@/store/category-module/CategoryModule';
import catalogueModule from '@/store/catalogue-module/CatalogueModule';
import addresses from '@/store/addresses/addresses';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    addresses,
    baseModule,
    carts,
    layout,
    loader,
    payments,
    products,
    authModule,
    languageModule,
    brands,
    providers,
    categoryModule,
    catalogueModule    
  },
  plugins: [createPersistedState({ storage: window.sessionStorage })],
});
