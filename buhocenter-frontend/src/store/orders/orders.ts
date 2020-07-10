import { Module } from 'vuex/types';
import OrdersTypes from '@/store/orders/methods/orders.methods';
import OrdersRepository from '@/modules/management/orders/repositories/orders.repository';
import { Order } from '@/modules/management/orders/interfaces/orders.interface';
import { OrdersStateInterface } from './interfaces/orders.state.interface';
import { ORDERS_EMPTY_STATE } from './orders.state';

const offers: Module<OrdersStateInterface, any> = {
    namespaced: true,
    state: ORDERS_EMPTY_STATE,
    getters: {
        [OrdersTypes.getters.GET_ORDERS](state): Order[] {
            return state.orders;
        },
        [OrdersTypes.getters.GET_ORDERS_QUANTITY](state): number {
            return state.quantity;
        },
    },
    mutations: {
        [OrdersTypes.mutations.SET_ORDERS_QUANTITY](state, quantity: number): void {
            state.quantity = quantity;
        },
        [OrdersTypes.mutations.SET_ORDERS](state, orders: Order[]): void {
            state.orders = orders;
        },
    },
    actions: {
        async [OrdersTypes.actions.FETCH_ORDERS](
            { commit },
            payload: { start: number; limit: number },
        ): Promise<boolean> {
            try {
                const results = await OrdersRepository.getOrders(payload.start, payload.limit);
                commit(OrdersTypes.mutations.SET_ORDERS, results.payments);
                commit(OrdersTypes.mutations.SET_ORDERS_QUANTITY, results.paymentsNumber);
                return true;
            } catch (e) {
                return false;
            }
        },
    },
};

export default offers;
