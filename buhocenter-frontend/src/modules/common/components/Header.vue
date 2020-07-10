<template>
    <div>
        <v-navigation-drawer
            v-model="drawer"
            :clipped="$vuetify.breakpoint.lgAndUp"
            app
            width="400px"
            right
            temporary
        >
            <v-icon large color="primary" class="mt-3 ml-3" @click="drawer = false">
                mdi-window-close
            </v-icon>
            <Cart></Cart>
        </v-navigation-drawer>

        <v-snackbar v-model="snackbar" top :timeout="6000" color="error">
            <b>{{ $t('ERROR_LANGUAGES') }}</b>
            <v-btn color="white" text @click="snackbar = false">{{ $t('CLOSE') }}</v-btn>
        </v-snackbar>

        <v-app-bar clipped-left app color="white" light>
            <v-app-bar-nav-icon class="hidden-md-and-up" @click="openSideMenu"></v-app-bar-nav-icon>

            <v-spacer class="hidden-md-and-up" />

            <v-toolbar-title
                class="ml-0 overline title-logo cursorNavbar"
                style="height: 64px;"
                @click="goToHome()"
            >
                <v-img src="../../../assets/logo-header.png" width="250" height="64"></v-img>
            </v-toolbar-title>

            <v-spacer />

            <div class="pr-3 hidden-sm-and-down" v-if="inDashboard">
                <SearchBar size="large" />
            </div>
            <div class="mr-2 ml-4 hidden-sm-and-down">
                <v-menu offset-y bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn color="primary" dark v-on="on">{{ getLanguagePlatform }}</v-btn>
                    </template>
                    <v-list>
                        <v-list-item
                            v-for="(item, i) in getLanguages"
                            :key="i"
                            @click="changeLanguagePlatform(item.code)"
                        >
                            <v-row>
                                <v-col cols="4">
                                    <v-img
                                        :src="require(`../../../assets/flags/${item.code}.png`)"
                                        height="18"
                                        width="18"
                                    ></v-img>
                                </v-col>
                                <v-col cols="8">{{ item.name }}</v-col>
                            </v-row>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </div>
            <div class="mr-2 ml-2 hidden-sm-and-down">
                <CurrencySelector></CurrencySelector>
            </div>
            <div class="mr-2 ml-2 hidden-sm-and-down" v-if="getStatusLogin">
                <div class="text-xs-center">
                    <v-menu v-model="menu" :close-on-content-click="true" :nudge-width="200" offset-y bottom>
                        <template v-slot:activator="{ on }">
                            <v-btn text v-on="on">{{ getClient.name }}</v-btn>
                        </template>
                        <v-card>
                            <v-list>
                                <v-list-item to="/profile">
                                    <v-icon large color="primary">mdi-account-circle-outline</v-icon>
                                    <v-list-item-title class="ml-2">{{ $t('MY_ACCOUNT') }}</v-list-item-title>
                                </v-list-item>
                            </v-list>
                            <v-divider></v-divider>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" dense @click="signOut()">{{ $t('SIGN-OUT') }}</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-menu>
                </div>
            </div>
            <div class="mr-2 ml-2 hidden-sm-and-down" v-else>
                <router-link to="/sign-in">
                    <v-btn text>{{ $t('SIGN-IN') }}</v-btn>
                </router-link>
            </div>
            <div
                class="pr-4 cursorNavbar hidden-sm-and-down"
                @click.stop="drawer = !drawer"
                v-if="getStatusLogin"
            >
                <v-badge
                    color="primary"
                    :content="getToken !== '' ? GET_CART_OBJECT.length : '0'"
                    :value="getToken !== '' ? GET_CART_OBJECT.length : '0'"
                >
                    <v-icon color="primary">mdi-cart</v-icon>
                </v-badge>
            </div>
        </v-app-bar>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Cart from '@/modules/client/cart/components/Cart.vue';
import { authModule, carts, languageModule } from '@/store/namespaces';
import { Watch, Prop } from 'vue-property-decorator';
import CartMethods from '@/store/carts/methods/cart.methods';
import AuthMethods from '@/store/auth/methods/auth.methods';
import LanguageMethods from '@/store/languages/methods/language.methods';
import { i18n } from '@/i18n/i18n';
import { FETCHED, FETCHING } from '@/config/constants';
import { CustomerInterface } from '@/modules/client/auth/interfaces/customer.interface';
import { CartInterface } from '@/modules/client/cart/interfaces/carts.interface';
import CurrencySelector from '@/modules/currency/components/CurrencySelector.vue';
import SearchBar from './SearchBar.vue';

@Component({
    components: { CurrencySelector, Cart, SearchBar },
})
export default class Header extends Vue {
    @Prop() openCart!: boolean;

    @Watch('openCart')
    draw(): void {
        this.drawer = !this.drawer;
    }

    inDashboard = true;
    drawer = false;
    dialog = false;
    menu = false;
    message = false;
    hints = true;
    fetching = FETCHING;
    fetched = FETCHED;
    snackbar = false;

    async signOut(): Promise<void> {
        await this.logout();
        this.EMPTY_CART();
        localStorage.clear();
        sessionStorage.clear();
        this.goToHome();
    }

    openSideMenu(): void {
        this.drawer = false;
        this.$emit('openSideMenu');
    }

    goToHome(): void {
        this.$router.currentRoute.path != '/home' ? this.$router.push('/home') : false;
    }

    @Watch('$route')
    offSearchBox(): void {
        this.inDashboard = true;
        let path = this.$router.currentRoute.path.split('/');
        path.forEach((element) => {
            if (element == 'dashboard') {
                this.inDashboard = false;
            }
        });
    }

    async mounted(): Promise<void> {
        this.offSearchBox();
        if (this.getLanguages.length === 0) {
            await this.apiGetLanguages();
            this.snackbar = this.getErrLanguages;
        }
        if (this.getLanguagePlatform !== i18n.locale) {
            if (this.getStatusLogin) {
                await this.changeLanguagePlatform(this.getClient.language ? this.getClient.language : 'en');
            } else {
                await this.changeLanguagePlatform(this.getLanguagePlatform);
            }
        }
    }

    async changeLanguagePlatform(code: string): Promise<void> {
        await this.apiChangeLanguage(code);
        this.snackbar = this.getErrLoadLanguage;
    }

    get getStatusLogin(): boolean {
        const token: string = this.getToken;
        return !!token;
    }

    @authModule.Action(AuthMethods.actions.LOGOUT) logout!: () => boolean;

    @authModule.Getter(AuthMethods.getters.GET_CLIENT_DATA)
    getClient!: CustomerInterface;
    @authModule.Getter(AuthMethods.getters.GET_AUTH_TOKEN) getToken!: string;

    @carts.Getter(CartMethods.getters.GET_CART_OBJECT)
    GET_CART_OBJECT!: CartInterface;
    @carts.Action(CartMethods.actions.EMPTY_CART) EMPTY_CART!: () => void;

    @languageModule.Action(LanguageMethods.actions.API_GET_LANGUAGES)
    apiGetLanguages!: () => boolean;
    @languageModule.Action(LanguageMethods.actions.API_CHANGE_LANGUAGE)
    apiChangeLanguage!: (code: string) => boolean;
    @languageModule.Getter(LanguageMethods.getters.GET_LANGUAGES) getLanguages;
    @languageModule.Getter(LanguageMethods.getters.GET_PLATFORM_LANGUAGE)
    getLanguagePlatform!: string;
    @languageModule.Getter(LanguageMethods.getters.GET_LANGUAGE_ERR)
    getErrLanguages!: boolean;
    @languageModule.Getter(LanguageMethods.getters.GET_PLATFORM_LANGUAGE_ERROR)
    getErrLoadLanguage!: boolean;
    @languageModule.Getter(LanguageMethods.getters.GET_FETCH_PLATFORM_LANGUAGE)
    getFetchLanguage!: string;
}
</script>

<style>
.container-main {
    background-color: #f4f4f4;
}
.search {
    outline: none;
    border: 1px #f8f8f8;
    background: #ededed url('../../../assets/search.png') no-repeat 5px center;
    padding: 5px 8px 0px 26px;
    width: 200px;
    border-radius: 10em;
    transition: all 0.5s;
    margin-right: 10px;
}
.search:focus {
    width: 400px;
    border: solid 1px #ccc;
    background-color: #fff;
    border-color: #98ccfd;
    -webkit-box-shadow: 0 0 5px rgba(109, 207, 246, 0.5);
    -moz-box-shadow: 0 0 5px rgba(109, 207, 246, 0.5);
    box-shadow: 0 0 5px rgba(109, 207, 246, 0.5);
    backface-visibility: hidden;
}

.cursorNavbar {
    cursor: pointer;
}
</style>
