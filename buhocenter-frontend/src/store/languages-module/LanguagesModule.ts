import { Module } from 'vuex';
import LanguageTypes from '@/store/languages-module/methods/language-methos';
import LanguageRepository from '@/modules/languages-module/repositories/language.repository';
import {LanguageResponse} from '@/store/languages-module/interfaces/LanguageResponse';
import { SUCESS, FETCHING, FETCHED } from '@/config/constants';
import {i18n} from "@/i18n/i18n";

const loadedLanguages = ['en']
const languageModule: Module<any, any> = {
    namespaced: true,
    state: {
        platform_language: 'en',
        err_languages: false,
        err_set_languages: true,
        language_selected: '',
        fetch: FETCHED,
        languages: [],
    },
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
        [LanguageTypes.getters.GET_PLATFORM_LANGUAGE_ERROR](state): boolean{
            return state.err_set_languages;
        },
        [LanguageTypes.getters.GET_FETCH_PLATFORM_LANGUAGE](state): string{
            return state.fetch;
        }
    },
    mutations: {
        [LanguageTypes.mutations.GET_LANGUAGES_SUCCESS](state, data: Response ) {
            // @ts-ignore
            state.languages = data.list;
            state.err_languages = false;
        },
        [LanguageTypes.mutations.LANGUAGE_ERR](state) {
            state.err_languages = true;
        },
        [LanguageTypes.mutations.CHANGE_LANGUAGE_SUCCESS](state, data:any) {
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
                if ( response.response.status === SUCESS) {
                    commit( LanguageTypes.mutations.GET_LANGUAGES_SUCCESS, response );
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
                if ( loadedLanguages.includes(code) ) {
                    commit(LanguageTypes.mutations.CHANGE_LANGUAGE_LOAD_SUCCESS, code);
                    return true;
                }
                commit(LanguageTypes.mutations.FETCH_SET_LANGUAGE, FETCHING);
                const response = await LanguageRepository.setLanguage(code);
                if ( !response.hasOwnProperty('error') ) {
                    commit(LanguageTypes.mutations.CHANGE_LANGUAGE_SUCCESS, {code, terms: response[code]});
                    return true;
                }
                commit( LanguageTypes.mutations.CHANGE_LANGUAGE_ERROR );
                return true;
            } catch (e) {
                commit(LanguageTypes.mutations.CHANGE_LANGUAGE_ERROR);
                return false;
            }
        },
    },
};

export default languageModule;