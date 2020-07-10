import { Module } from 'vuex';
import PaymentsTypes from './methods/payments.methods';
import paymentsRepository from '../../modules/client/payments/repositories/payments.repository';
import productsFirebaseRepository from '@/modules/client/products/repositories/products.firebase';
import { Payment } from '@/modules/client/payments/interfaces/payments.interface';
import { Orders, ProductsOrder } from '@/modules/client/customers/interfaces/orders.interface';
import { ORDERS_STATE } from './payments.state';

const payments: Module<any, any> = {
    namespaced: true,
    state: ORDERS_STATE,
    getters: {
        [PaymentsTypes.getters.GET_ORDERS](state): Orders[] {
            return state.orders;
        },
        [PaymentsTypes.getters.GET_PRODUCTS_ORDER](state): ProductsOrder[] {
            return state.productsOrder;
        },
    },
    mutations: {
        [PaymentsTypes.mutations.SET_ORDERS](state, orders: Orders[]): void {
            state.orders = orders;
        },
        [PaymentsTypes.mutations.SET_PRODUCTS_ORDER](state, productsOrder: ProductsOrder[]): void {
            state.productsOrder = productsOrder;
        },
    },
    actions: {
        async [PaymentsTypes.actions.CREATE_ORDER]({ commit }, orderItems): Promise<string | boolean> {
            try {
                const paymentResponse: Payment = await paymentsRepository.createOrder(orderItems);
                return paymentResponse.redirectUrl;
            } catch (e) {
                return false;
            }
        },
        async [PaymentsTypes.actions.FETCH_ORDERS]({ commit }, customerId: number): Promise<boolean> {
            try {
                const response: Orders[] = await paymentsRepository.getCustomerOrders(customerId);
                commit(PaymentsTypes.mutations.SET_ORDERS, response);
                return true;
            } catch (e) {
                return false;
            }
        },
        async [PaymentsTypes.actions.FETCH_ORDER_BY_ID]({ commit }, orderId: number): Promise<boolean> {
            try {
                const response: ProductsOrder = await paymentsRepository.getOrderById(orderId);
                response.carts.forEach(async (el) => {
                    const principalPhoto: string = el.product.productPhotos![0].content!;
                    const photo = await productsFirebaseRepository.getProductPhotoByName(
                        el.product.id!,
                        principalPhoto,
                    );
                    el.product.productPhotos![0].content = photo;
                });
                commit(PaymentsTypes.mutations.SET_PRODUCTS_ORDER, response);
                return true;
            } catch (e) {
                return false;
            }
        },
    },
};

export default payments;
