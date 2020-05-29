import { Module } from 'vuex';
import {
    CREATE_ORDER,
} from './methods/payments.actions';
import paymentsRepository from '../../modules/payments/repositories/payments.repository';
import { AxiosResponse } from 'axios';

const payments: Module<any, any> = {
    namespaced: true,
    getters: {},
    mutations: {},
    actions: {
        async [CREATE_ORDER]({ commit }, orderItems): Promise<string | boolean> {
            try {
                console.log('orderItems', orderItems);
                const paymentResponse: { redirectUrl: string } = await paymentsRepository.createOrder(orderItems);
                // console.log('paymentResponse.redirectUrl', paymentResponse.redirectUrl);
                return paymentResponse.redirectUrl;
            } catch(e) {
                // console.log('e', e);
                return false;
            }
        }
    }
}

export default payments;