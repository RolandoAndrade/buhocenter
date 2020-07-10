import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Layout from '../views/Layout.vue';
import Auth from '../views/Auth.vue';
import Home from '../views/Home.vue';
import Catalogue from '@/modules/client/catalogue/components/Catalogue.vue';
import ItemDetail from '@/modules/client/products/components/ItemDetail.vue';
import Register from '../views/Register.vue';
import Profile from '@/modules/client/customers/components/Profile.vue';
import Catalogues from '@/modules/client/catalogues/components/Catalogues.vue';
import AddressManagement from '@/modules/client/addresses/components/AddressManagement.vue';
import Dashboard from '@/views/dashboard/Dashboard.vue';
import DashboardHome from '@/modules/management/home/components/Home.vue';
import DashboardCatalogues from '@/modules/management/catalogues/components/Catalogues.vue';
import DashboardCategories from '@/modules/management/categories/components/Categories.vue';
import DashboardClients from '@/modules/management/clients/components/Clients.vue';
import DashboardEmails from '@/modules/management/emails/components/Emails.vue';
import DashboardOrders from '@/modules/management/orders/components/DashboardOrders.vue';
import DashboardSettings from '@/modules/management/settings/components/DashboardSettings.vue';
import DashboardProducts from '@/modules/management/products/components/Products.vue';
import DashboardOffers from '@/modules/management/promotions/components/DashboardOffers.vue';
import DashboardServices from '@/modules/management/services/components/Services.vue';
import DashboardThirdParty from '@/modules/third-party/components/DashboardThirdParty.vue';
import PersonalInformation from '@/modules/client/customers/components/PersonalInformation.vue';
import Checkout from '../views/Checkout.vue';
import DashboardCreateOffer from '@/modules/management/promotions/components/CreateOffer.vue';
import DashboardAllOffers from '@/modules/management/promotions/components/AllOffers.vue';
import Orders from '@/modules/client/customers/components/Orders.vue';
import NotFound from '@/modules/common/components/NotFound.vue';
import { VueEasyJwt } from 'vue-easy-jwt';
import moment from 'moment';
const jwt = new VueEasyJwt();

Vue.use(VueRouter);

const routes: RouteConfig[] = [
    {
        path: '/',
        redirect: '/home',
        component: Layout,
        children: [
            {
                path: '/home',
                name: 'home',
                component: Home,
            },
            {
                path: '/sign-in',
                name: 'Sign in',
                component: Auth,
            },
            {
                path: '/profile',
                name: 'profile',
                component: Profile,
                meta: {
                    requiresAuth: true,
                },
            },
            {
                path: '/address-management',
                name: 'address-management',
                component: AddressManagement,
                meta: {
                    requiresAuth: true,
                },
            },
            {
                path: '/register',
                name: 'Register',
                component: Register,
            },
            {
                path: '/products',
                name: 'products',
                component: Catalogue,
            },
            {
                path: '/catalogues',
                name: 'catalogues',
                component: Catalogues,
            },
            {
                path: '/item-detail',
                name: 'item-detail',
                component: ItemDetail,
            },
            {
                path: '/dashboard',
                redirect: '/dashboard/home',
                component: Dashboard,
                meta: {
                    admin: true,
                    requiresAuth: true,
                },
                children: [
                    {
                        path: '/dashboard/home',
                        name: 'dashboard-home',
                        component: DashboardHome,
                        meta: {
                            admin: true,
                            requiresAuth: true,
                        },
                    },
                    {
                        path: '/dashboard/categories',
                        name: 'dashboard-categories',
                        component: DashboardCatalogues,
                        meta: {
                            admin: true,
                            requiresAuth: true,
                        },
                    },
                    {
                        path: '/dashboard/clients',
                        name: 'dashboard-clients',
                        component: DashboardClients,
                        meta: {
                            admin: true,
                            requiresAuth: true,
                        },
                    },
                    {
                        path: '/dashboard/emails',
                        name: 'dashboard-emails',
                        component: DashboardEmails,
                        meta: {
                            admin: true,
                            requiresAuth: true,
                        },
                    },
                    {
                        path: '/dashboard/orders',
                        name: 'dashboard-orders',
                        component: DashboardOrders,
                        meta: {
                            admin: true,
                            requiresAuth: true,
                        },
                    },
                    {
                        path: '/dashboard/platform',
                        name: 'dashboard-platform',
                        component: DashboardSettings,
                        meta: {
                            admin: true,
                            requiresAuth: true,
                        },
                    },
                    {
                        path: '/dashboard/products',
                        name: 'dashboard-products',
                        component: DashboardProducts,
                        meta: {
                            admin: true,
                            requiresAuth: true,
                        },
                    },
                    {
                        path: '/dashboard/promotions',
                        name: 'dashboard-promotions',
                        component: DashboardOffers,
                        meta: {
                            admin: true,
                            requiresAuth: true,
                        },
                        children: [
                            {
                                path: 'all',
                                name: 'dashboard-promotions-all',
                                component: DashboardAllOffers,
                                meta: {
                                    admin: true,
                                    requiresAuth: true,
                                },
                            },
                            {
                                path: 'create',
                                name: 'dashboard-promotions-create',
                                component: DashboardCreateOffer,
                                meta: {
                                    admin: true,
                                    requiresAuth: true,
                                },
                            },
                        ],
                    },
                    {
                        path: '/dashboard/services',
                        name: 'dashboard-servies',
                        component: DashboardServices,
                        meta: {
                            admin: true,
                            requiresAuth: true,
                        },
                    },
                    {
                        path: '/dashboard/third-party',
                        name: 'dashboard-third-party',
                        component: DashboardThirdParty,
                        meta: {
                            admin: true,
                            requiresAuth: true,
                        },
                    },
                ],
            },
            {
                path: '/your-account',
                name: 'your-account',
                component: PersonalInformation,
                meta: {
                    requiresAuth: true,
                },
            },
            {
                path: '/your-orders',
                name: 'your-orders',
                component: Orders,
                meta: {
                    requiresAuth: true,
                },
            },
        ],
    },
    {
        path: '/checkout',
        component: Checkout,
        meta: {
            requiresAuth: true,
        },
    },
    {
        path: '/petromiles',
        beforeEnter() {
            window.open('https://petromiles-frontend.herokuapp.com/', '_blank');
        },
    },
    {
        path: '/shipthis',
        beforeEnter() {
            window.open('https://ship-this.herokuapp.com/', '_blank');
        },
    },
    {
        path: '*',
        name: 'not-found',
        component: NotFound,
        meta: {
            requiresAuth: false,
        },
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
});

router.beforeEach((to, from, next) => {
    window.scrollTo(0, 0);
    to.matched.some((route) => {
        let checkAdmin = false;
        if (route.meta.admin && sessionStorage.getItem('vuex') !== null) {
            const vuexStorage: string | null = sessionStorage.getItem('vuex');
            if (JSON.parse(vuexStorage == undefined ? '' : vuexStorage).authModule.data.role !== undefined) {
                if (
                    JSON.parse(vuexStorage == undefined ? '' : vuexStorage).authModule.data.role.name !==
                    'Admin'
                ) {
                    checkAdmin = true;
                    next({ path: '/not-found' });
                } else {
                    next();
                }
            } else {
                checkAdmin = true;
                next({ path: '/not-found' });
            }
        }
        if (route.meta.requiresAuth && !checkAdmin) {
            if (localStorage.getItem('token') !== null) {
                const yourToken: any = localStorage.getItem('token');
                const tokenData: any = jwt.decodeToken(yourToken);
                if (!moment(moment.unix(tokenData.exp).utc()).isSameOrAfter(moment().utc())) {
                    localStorage.clear();
                    sessionStorage.clear();
                    next({ path: '/sign-in' });
                } else {
                    next();
                }
            } else {
                localStorage.clear();
                sessionStorage.clear();
                next({ path: '/sign-in' });
            }
        } else {
            next();
        }
    });
});

export default router;
