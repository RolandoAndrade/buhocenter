import { Module } from 'vuex/types';
import AddressTypes from '@/store/addresses/methods/address.methods';
import addressRepository from '@/modules/client/addresses/repositories/addresses.repository';
import { Address } from '@/modules/client/addresses/interfaces/address.interface';
import { AddressesStateInterface } from './interfaces/addresses.state.interface';
import { ADDRESSES_EMPTY_STATE } from './addresses.state';

const addresses: Module<AddressesStateInterface, any> = {
    namespaced: true,
    state: ADDRESSES_EMPTY_STATE,
    getters: {
        [AddressTypes.getters.GET_ADDRESSES](state): Address[] {
            return state.addresses;
        },
    },
    mutations: {
        [AddressTypes.mutations.SET_ADDRESSES](state, addresses: Address[]): void {
            state.addresses = addresses;
        },
        [AddressTypes.mutations.DISPLAY_DIALOG](state, display: boolean): void {
            state.display = display;
        },
    },
    actions: {
        async [AddressTypes.actions.CREATE_ADDRESS]({ commit }, address: Address): Promise<boolean> {
            try {
                const response: Address[] = await addressRepository.createAddress(address);
                return true;
            } catch (e) {
                return false;
            }
        },
        async [AddressTypes.actions.FETCH_ADDRESSES]({ commit }, customerId: number): Promise<boolean> {
            try {
                const response: Address[] = await addressRepository.getCustomerAddresses(customerId);
                commit(AddressTypes.mutations.SET_ADDRESSES, response);
                return true;
            } catch (e) {
                return false;
            }
        },
        async [AddressTypes.actions.DELETE_ADDRESS]({ commit }, addressId: number): Promise<boolean> {
            try {
                await addressRepository.deleteAddress(addressId);
                return true;
            } catch (e) {
                return false;
            }
        },
        async [AddressTypes.actions.SET_DEFAULT_ADDRESS](
            { commit },
            defaultAddress: Address,
        ): Promise<boolean> {
            try {
                await addressRepository.setAddressAsDefault(defaultAddress);
                return true;
            } catch (e) {
                return false;
            }
        },
        [AddressTypes.actions.SHOW_CREATE_ADDRESS_DIALOG]({ commit }, display: boolean): void {
            commit(AddressTypes.mutations.DISPLAY_DIALOG, display);
        },
    },
};

export default addresses;
