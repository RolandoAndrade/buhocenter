import { Module } from 'vuex';
import LanguageTypes from '@/store/languages/methods/language.methods';
import LanguageRepository from '@/modules/common/languages/repositories/language.repository';
import { SUCESS, FETCHING, FETCHED } from '@/config/constants';
import { i18n } from '@/i18n/i18n';
import { LANGUAGES_EMPTY_STATE } from './languages.state';
import { LanguagesStateInterface } from './interfaces/languagaes.state.interface';

const loadedLanguages = ['en'];
const languageModule: Module<LanguagesStateInterface, any> = {
    namespaced: true,
    state: LANGUAGES_EMPTY_STATE,
    getters: {
        [LanguageTypes.getters.GET_LANGUAGES](state): any[] {
            return state.languages;
        },
        [LanguageTypes.getters.GET_LANGUAGE_ERR](state): boolean {
            return state.err_languages;
        },
        [LanguageTypes.getters.GET_PLATFORM_LANGUAGE](state): string {
            return state.platform_language;
        },
        [LanguageTypes.getters.GET_PLATFORM_LANGUAGE_ERROR](state): boolean {
            return state.err_set_languages;
        },
        [LanguageTypes.getters.GET_FETCH_PLATFORM_LANGUAGE](state): string {
            return state.fetch;
        },
    },
    mutations: {
        [LanguageTypes.mutations.GET_LANGUAGES_SUCCESS](state, data: Response) {
            // eslint-disable-next-line
            // @ts-ignore
            state.languages = data.list;
            state.err_languages = false;
        },
        [LanguageTypes.mutations.LANGUAGE_ERR](state) {
            state.err_languages = true;
        },
        [LanguageTypes.mutations.CHANGE_LANGUAGE_SUCCESS](state, data: any) {
            i18n.setLocaleMessage(data.code, data.terms);
            i18n.locale = data.code;
            loadedLanguages.push(data.code);
            state.platform_language = data.code;
            state.loadedLanguages = data.code;
            state.platform_language = data.code;
            state.err_set_languages = false;
            state.fetch = FETCHED;
        },
        [LanguageTypes.mutations.CHANGE_LANGUAGE_LOAD_SUCCESS](state, code: string) {
            state.platform_language = code;
            i18n.locale = code;
            state.fetch = FETCHED;
        },
        [LanguageTypes.mutations.CHANGE_LANGUAGE_ERROR](state) {
            state.err_set_languages = true;
            state.fetch = FETCHED;
        },
        [LanguageTypes.mutations.FETCH_SET_LANGUAGE](state, status: string) {
            state.fetch = status;
        },
    },
    actions: {
        async [LanguageTypes.actions.API_GET_LANGUAGES]({ commit }): Promise<boolean> {
            try {
                const response = await LanguageRepository.getLanguages();
                if (response.response.status === SUCESS) {
                    commit(LanguageTypes.mutations.GET_LANGUAGES_SUCCESS, response);
                    return true;
                }
                commit(LanguageTypes.mutations.LANGUAGE_ERR, response.error);
                return false;
            } catch (e) {
                commit(LanguageTypes.mutations.LANGUAGE_ERR, {});
                return false;
            }
        },
        async [LanguageTypes.actions.API_CHANGE_LANGUAGE]({ commit, state }, code: string): Promise<boolean> {
            try {
                if (loadedLanguages.includes(code)) {
                    commit(LanguageTypes.mutations.CHANGE_LANGUAGE_LOAD_SUCCESS, code);
                    return true;
                }
                commit(LanguageTypes.mutations.FETCH_SET_LANGUAGE, FETCHING);
                const response = await LanguageRepository.setLanguage(code);
                // eslint-disable-next-line
                if (!response.hasOwnProperty('error')) {
                    commit(LanguageTypes.mutations.CHANGE_LANGUAGE_SUCCESS, {
                        code,
                        terms: response[code],
                    });
                    return true;
                }
                commit(LanguageTypes.mutations.CHANGE_LANGUAGE_ERROR);
                return true;
            } catch (e) {
                commit(LanguageTypes.mutations.CHANGE_LANGUAGE_ERROR);
                return false;
            }
        },
    },
};

export default languageModule;
