import { Module } from 'vuex';
import SettingsHttpRepository from '@/modules/management/settings/repositories/settings.repository';
import { SETTINGS_EMPTY_STATE } from './settings.state';
import { SettingsStateInterface } from './interfaces/settings.state.interface';
import SettingsTypes from '@/store/settings/methods/settings.methods';
import { Commission } from '@/modules/management/settings/interfaces/commissions.interface';

const Settings: Module<SettingsStateInterface, any> = {
    namespaced: true,
    state: SETTINGS_EMPTY_STATE,
    getters: {
        [SettingsTypes.getters.GET_COMMISSIONS](state) {
            return state.commissions;
        },
    },
    mutations: {
        [SettingsTypes.mutations.SET_COMMISSIONS](state, commissions: Commission[]) {
            state.commissions = commissions;
        },
    },
    actions: {
        async [SettingsTypes.actions.FETCH_COMMISSIONS]({ commit }): Promise<boolean> {
            try {
                const response: Commission[] = await SettingsHttpRepository.getCommissions();
                commit(SettingsTypes.mutations.SET_COMMISSIONS, response);
                return true;
            } catch (e) {
                return false;
            }
        },
        async [SettingsTypes.actions.CREATE_COMMISSION](
            { commit },
            commission: Commission,
        ): Promise<boolean> {
            try {
                await SettingsHttpRepository.createCommission(commission);
                return true;
            } catch (e) {
                return false;
            }
        },
    },
};

export default Settings;
