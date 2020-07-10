import { Module } from 'vuex/types';
import ClientsTypes from '@/store/clients/methods/clients.methods';
import clientsRepository from '@/modules/management/clients/repositories/clients.repository';
import { ClientInterface } from '@/modules/management/clients/interfaces/clients.interface';
import { ClientsStateInterface } from './interfaces/clients.state.interface';
import { CLIENTS_EMPTY_STATE } from './clients.state';

const clients: Module<ClientsStateInterface, any> = {
    namespaced: true,
    state: CLIENTS_EMPTY_STATE,
    getters: {
        [ClientsTypes.getters.GET_CLIENTS](state): ClientInterface[] {
            return state.clients;
        },
    },
    mutations: {
        [ClientsTypes.mutations.SET_CLIENTS](state, clients: ClientInterface[]): void {
            state.clients = clients;
        },
    },
    actions: {
        async [ClientsTypes.actions.GET_ALL_CLIENTS]({ commit }): Promise<boolean> {
            try {
                const response = await clientsRepository.getAllClients();
                if (!response.error) {
                    commit(ClientsTypes.mutations.SET_CLIENTS, response);
                    return true;
                }
                return false;
            } catch (e) {
                return false;
            }
        },

        async [ClientsTypes.actions.BLOCK_AND_UNBLOCK_CLIENTS]({ commit }, Client): Promise<boolean> {
            try {
                const response = await clientsRepository.blockAndUnblockClients(Client);
                if (!response.error) {
                    commit(ClientsTypes.mutations.SET_CLIENTS, response);
                    return true;
                }
                return false;
            } catch (e) {
                return false;
            }
        },
    },
};

export default clients;
