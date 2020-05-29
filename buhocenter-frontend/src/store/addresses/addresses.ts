import { Module } from 'vuex';
import AddressTypes from '@/store/addresses/methods/address-methods';
import addressRepository from '@/modules/customers/repositories/addresses.repository';
import { Address } from '@/modules/customers/interfaces/address.interface';

const addresses: Module<any, any> = {
    namespaced: true,
    state: {
        display: false,
        addresses: [],
    },
    getters: {
        [AddressTypes.getters.GET_ADDRESSES](state): string {
            return state.addresses;
        },
    },
    mutations: {
        [AddressTypes.mutations.SET_ADDRESSES](state, addresses): void {
            state.addresses = addresses;
        },
        [AddressTypes.mutations.DISPLAY_DIALOG](state, display: boolean): void {
            state.display = display;
        }
    },
    actions: {
        async [AddressTypes.actions.CREATE_ADDRESS]({ commit }, address: Address): Promise<boolean> {
            try {
                const response = await addressRepository.createAddress(address);
                console.log('response', response);
                
                // commit(AddressTypes.mutations.SET_ADDRESSES, response);
                return true;
            } catch(e) {
                return false;
            }
        },
        async [AddressTypes.actions.FETCH_ADDRESSES]({ commit }, customerId: number): Promise<boolean> {
            try {
                const response = await addressRepository.getCustomerAddresses(customerId);
                console.log('response', response);
                commit(AddressTypes.mutations.SET_ADDRESSES, response);
                return true;
            } catch(e) {
                return false;
            }
        },
        async [AddressTypes.actions.DELETE_ADDRESS]({ commit }, addressId: number): Promise<boolean> {
            try {
                const response = await addressRepository.deleteAddress(addressId);
                console.log('response', response);
                return true;
            } catch(e) {
                return false;
            }
        },
        async [AddressTypes.actions.SET_DEFAULT_ADDRESS]({ commit }, defaultAddress): Promise<boolean> {
            try {
                console.log('defaultAddress', defaultAddress);
                const response = await addressRepository.setAddressAsDefault(defaultAddress);
                console.log('response', response);
                return true;
            } catch(e) {
                return false;
            }
        },
        [AddressTypes.actions.SHOW_CREATE_ADDRESS_DIALOG]({ commit }, display: boolean): void {
            commit(AddressTypes.mutations.DISPLAY_DIALOG, display);
        }
    },
}

export default addresses;