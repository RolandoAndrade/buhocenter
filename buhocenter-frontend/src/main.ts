import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import { i18n } from '@/i18n/i18n';
import { CurrencyPlugin } from '@/plugins/currency/currency.plugin';
const VueTheMask = require('vue-the-mask').default;

Vue.config.productionTip = false;
Vue.use(CurrencyPlugin);
Vue.use(VueTheMask);

new Vue({
    router,
    store,
    vuetify,
    i18n,
    render: (h) => h(App),
}).$mount('#app');
