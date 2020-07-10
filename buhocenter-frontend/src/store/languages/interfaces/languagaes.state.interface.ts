export interface LanguagesStateInterface {
    platform_language: string;
    err_languages: boolean;
    err_set_languages: boolean;
    language_selected: string;
    fetch: string;
    languages: Array<any>;
    loadedLanguages: any; // por ahora
}
