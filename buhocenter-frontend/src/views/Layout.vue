<template>
    <v-app id="inspire">
        <v-container v-if="getFetchLanguage === fetching || isLoading">
            <LoadingPage />
        </v-container>
        <v-container v-else fluid class="container-main">
            <MobileMenu v-bind:open-side-menu="drawer" @openCart="openCart" />
            <Header v-bind:open-cart="drawerSC" @openSideMenu="openSideMenu" />
            <v-content>
                <v-fade-transition hide-on-leave>
                    <router-view></router-view>
                </v-fade-transition>
            </v-content>
            <Footer v-if="!this.$route.meta.admin" />
        </v-container>
    </v-app>
</template>

<script lang="ts">
import { authModule, languageModule, loader } from '@/store/namespaces';
import AuthMethods from '@/store/auth/methods/auth.methods';
import { Component, Vue } from 'vue-property-decorator';
import LoadingPage from '@/views/LoadingPage.vue';
import LanguageMethods from '@/store/languages/methods/language.methods';
import { FETCHED, FETCHING } from '@/config/constants';
import LoaderTypes from '@/store/loader/methods/loader.methods';
import Header from '@/modules/common/components/Header.vue';
import Footer from '@/modules/common/components/Footer.vue';
import MobileMenu from '@/modules/common/components/MobileMenu.vue';

@Component({
    components: { Footer, Header, LoadingPage, MobileMenu },
})
export default class Layout extends Vue {
    fetching = FETCHING;
    fetched = FETCHED;
    draw = false;
    drawSC = false;

    openSideMenu(): void {
        this.draw = !this.draw;
    }

    openCart(): void {
        this.drawSC = !this.drawSC;
    }

    get drawer(): boolean {
        return this.draw;
    }

    get drawerSC(): boolean {
        return this.drawSC;
    }

    @authModule.Action(AuthMethods.actions.LOGOUT) logout;
    @authModule.Getter(AuthMethods.getters.GET_CLIENT_DATA) getClient;
    @authModule.Getter(AuthMethods.getters.GET_AUTH_TOKEN) getToken;

    @loader.Getter(LoaderTypes.getters.IS_LOADING) isLoading;

    @languageModule.Action(LanguageMethods.actions.API_GET_LANGUAGES)
    apiGetLanguages;
    @languageModule.Action(LanguageMethods.actions.API_CHANGE_LANGUAGE)
    apiChangeLanguage;
    @languageModule.Getter(LanguageMethods.getters.GET_LANGUAGES) getLanguages;
    @languageModule.Getter(LanguageMethods.getters.GET_PLATFORM_LANGUAGE)
    getLanguagePlatform;
    @languageModule.Getter(LanguageMethods.getters.GET_LANGUAGE_ERR)
    getErrLanguages;
    @languageModule.Getter(LanguageMethods.getters.GET_PLATFORM_LANGUAGE_ERROR)
    getErrLoadLanguage;
    @languageModule.Getter(LanguageMethods.getters.GET_FETCH_PLATFORM_LANGUAGE)
    getFetchLanguage;
}
</script>

<style>
.container-main {
    background-color: #f4f4f4;
    padding: 0px;
}
</style>
