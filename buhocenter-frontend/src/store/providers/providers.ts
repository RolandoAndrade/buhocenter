import { Module } from 'vuex';
import ProvidersHttpRepository from '@/modules/client/provider/repositories/providers.repository';
import { PROVIDERS_EMPTY_STATE } from './providers.state';
import { ProviderStateInterface } from './interfaces/providers.state.interface';
import { Provider } from '@/modules/client/provider/interfaces/provider.interface';
import ProvidersTypes from '@/store/providers/methods/providers.methods';

const Providers: Module<ProviderStateInterface, any> = {
    namespaced: true,
    state: PROVIDERS_EMPTY_STATE,
    getters: {
        [ProvidersTypes.getters.GET_PROVIDERS](state) {
            return state.Providers;
        },
    },
    mutations: {
        [ProvidersTypes.mutations.GET_PROVIDERS_SUCCESS](state, providers: Provider[]) {
            // eslint-disable-next-line
            // @ts-ignore
            state.Providers = providers;
        },
    },
    actions: {
        async [ProvidersTypes.actions.FETCH_PROVIDERS]({ commit }): Promise<boolean> {
            try {
                const response: Provider[] = await ProvidersHttpRepository.getProviders();
                commit(ProvidersTypes.mutations.GET_PROVIDERS_SUCCESS, response);
                return false;
            } catch (e) {
                return true;
            }
        },
    },
};

export default Providers;
