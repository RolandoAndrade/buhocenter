<template>
  <v-app id="inspire">

    <div v-if="getFetchLanguage === fetching || isLoading">
      <LoadingPage></LoadingPage>
    </div>
    <div v-else>
      <Header></Header>
      <v-content class="pa-0 container-main">
        <v-container fluid class="container-principal">
          <router-view></router-view>
          <Footer></Footer>
        </v-container>
      </v-content>
    </div>
  </v-app>
</template>

<script lang="ts">
  import { authModule, languageModule, loader } from "@/store/namespaces";
  import AuthMethods from "@/store/auth-module/methods/auth-methods";
  import {Component, Vue} from "vue-property-decorator";
  import LoadingPage from "@/views/LoadingPage.vue";
  import LanguageMethods from "@/store/languages-module/methods/language-methos";
  import { FETCHED, FETCHING } from "@/config/constants";
  import { IS_LOADING } from '../store/loader/methods/loader.getters';
  import { SHOW_LOADER } from '../store/loader/methods/loader.actions';
  import {i18n} from "@/i18n/i18n";
  import Header from "@/modules/header-module/Header.vue";
  import Footer from "@/modules/footer-module/Footer.vue";

  @Component({
    components: {Footer, Header, LoadingPage },
  })
  export default class Layout extends Vue {
    fetching = FETCHING;
    fetched = FETCHED;



    @authModule.Action(AuthMethods.actions.LOGOUT) logout;
    @authModule.Getter(AuthMethods.getters.GET_CLIENT_DATA) getClient;
    @authModule.Getter(AuthMethods.getters.GET_AUTH_TOKEN) getToken;

    @loader.Getter(IS_LOADING) isLoading;

    @languageModule.Action(LanguageMethods.actions.API_GET_LANGUAGES) apiGetLanguages;
    @languageModule.Action(LanguageMethods.actions.API_CHANGE_LANGUAGE) apiChangeLanguage;
    @languageModule.Getter(LanguageMethods.getters.GET_LANGUAGES) getLanguages;
    @languageModule.Getter(LanguageMethods.getters.GET_PLATFORM_LANGUAGE) getLanguagePlatform;
    @languageModule.Getter(LanguageMethods.getters.GET_LANGUAGE_ERR) getErrLanguages;
    @languageModule.Getter(LanguageMethods.getters.GET_PLATFORM_LANGUAGE_ERROR) getErrLoadLanguage;
    @languageModule.Getter(LanguageMethods.getters.GET_FETCH_PLATFORM_LANGUAGE) getFetchLanguage;
  }
</script>

<style>
  .container-main { background-color: #f4f4f4 }



  .container-principal {
    position: relative;
    top: 66px;
    padding: 0px 0px 0px 0px !important;
  }





</style>
