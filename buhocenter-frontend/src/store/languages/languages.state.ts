import { FETCHED } from '@/config/constants';
import { LanguagesStateInterface } from './interfaces/languagaes.state.interface';

export const LANGUAGES_EMPTY_STATE: LanguagesStateInterface = {
    platform_language: 'en',
    err_languages: false,
    err_set_languages: true,
    language_selected: '',
    fetch: FETCHED,
    languages: [],
    loadedLanguages: '',
};
