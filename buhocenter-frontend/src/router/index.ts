import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Layout from '../views/Layout.vue';
import Auth from '../views/Auth.vue';
import Home from '../views/Home.vue';
import Catalogue from '../modules/products/catalogue/Catalogue.vue';
import ItemDetail from '../modules/products/item-detail/ItemDetail.vue';
import Register from '../views/Register.vue';
import Profile from '../modules/customers/profile/Profile.vue';
import Catalogues from "@/modules/products/catalogues/Catalogues.vue";
import AddressManagement from '../modules/customers/profile/AddressManagement.vue';
import CreateAddressForm from '../modules/customers/addresses/CreateAddressForm.vue';
import Dashboard from '@/views/dashboard/Dashboard.vue';
import DashboardHome from '@/modules/dashboard/components/Home.vue';
import DashboardCatalogues from '@/modules/dashboard/components/Catalogues.vue';
import DashboardCategories from '@/modules/dashboard/components/Categories.vue';
import DashboardClients from '@/modules/dashboard/components/Clients.vue';
import DashboardEmails from '@/modules/dashboard/components/Emails.vue';
import DashboardOrders from '@/modules/dashboard/components/Orders.vue';
import DashboardPlatform from '@/modules/dashboard/components/Platform.vue';
import DashboardProducts from '@/modules/dashboard/components/Products.vue';
import DashboardPromotions from '@/modules/dashboard/components/Promotions.vue';
import DashboardServices from '@/modules/dashboard/components/Services.vue';
import PersonalInformation from '../modules/customers/profile/PersonalInformation.vue';


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
      },
      {
        path: "/address-management",
        name: "address-management",
        component: AddressManagement,
      },
      {
        path: '/create-address',
        name: 'create-address',
        component: CreateAddressForm,
      },
      {
        path: "/register",
        name: "Register",
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
        children: [
          {
            path: '/dashboard/home',
            name: 'dashboard-home',
            component: DashboardHome,
          },
          {
            path: '/dashboard/catalogues',
            name: 'dashboard-catalogues',
            component: DashboardCatalogues,
          },
          {
            path: '/dashboard/categories',
            name: 'dashboard-categories',
            component: DashboardCategories,
          },
          {
            path: '/dashboard/clients',
            name: 'dashboard-clients',
            component: DashboardClients,
          },
          {
            path: '/dashboard/emails',
            name: 'dashboard-emails',
            component: DashboardEmails,
          },
          {
            path: '/dashboard/orders',
            name: 'dashboard-emails',
            component: DashboardOrders,
          },
          {
            path: '/dashboard/platform',
            name: 'dashboard-platform',
            component: DashboardPlatform,
          },
          {
            path: '/dashboard/products',
            name: 'dashboard-products',
            component: DashboardProducts,
          },
          {
            path: '/dashboard/promotions',
            name: 'dashboard-promotions',
            component: DashboardPromotions,
          },
          {
            path: '/dashboard/services',
            name: 'dashboard-servies',
            component: DashboardServices,
          },
        ],
      },
      {
        path: "/your-account",
        name: "your-account",
        component: PersonalInformation,
      },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
