<template>
    <v-navigation-drawer v-model="readyOpen" fixed temporary width="300">
        <v-row>
            <v-col class="d-flex justify-center align-center mt-2 align-center">
                <p class="mb-0 headline">{{ $t('MENU') }}</p>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <div v-if="getStatusLogin" class="d-flex justify-center">
                    <v-menu v-model="menu" :close-on-content-click="true" :nudge-width="200" offset-x>
                        <template v-slot:activator="{ on }">
                            <v-btn text v-on="on">
                                {{ getClient.name + ' ' + getClient.lastName }}
                            </v-btn>
                        </template>
                        <v-card>
                            <v-list>
                                <v-list-item avatar to="/profile">
                                    <v-list-item-action>
                                        <v-list-item-title>{{
                                            $t('PROFILE') + ': ' + getClient.name + ' ' + getClient.lastName
                                        }}</v-list-item-title>
                                    </v-list-item-action>
                                </v-list-item>
                            </v-list>
                            <v-divider></v-divider>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" flat @click="signOut()">{{ $t('LOG-OUT') }}</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-menu>
                </div>
                <div v-else class="d-flex justify-center">
                    <router-link to="/sign-in">
                        <v-btn text>
                            {{ $t('SIGN-IN') }}
                        </v-btn>
                    </router-link>
                </div>
                <div class="d-flex justify-center cursorNavbar mt-8" @click="openCart" v-if="getStatusLogin">
                    <v-badge
                        color="primary"
                        :content="getToken !== '' ? GET_CART_OBJECT.length : '0'"
                        :value="getToken !== '' ? GET_CART_OBJECT.length : '0'"
                    >
                        <v-icon color="primary">mdi-cart</v-icon>
                    </v-badge>
                </div>
                <div class="d-flex justify-center mx-10 mt-12">
                    <SearchBar size="mobile" />
                </div>
                <div class="d-flex justify-center mx-10 mt-12">
                    <v-menu transition="slide-x-transition" bottom right>
                        <template v-slot:activator="{ on }">
                            <v-btn color="primary" dark v-on="on" block>
                                {{ getLanguagePlatform }}
                            </v-btn>
                        </template>
                        <v-list>
                            <v-list-item
                                v-for="(item, i) in getLanguages"
                                :key="i"
                                @click="changeLanguagePlatform(item.code)"
                            >
                                <v-row>
                                    <v-col cols="4"
                                        ><v-img
                                            :src="require(`../../../assets/flags/${item.code}.png`)"
                                            height="18"
                                            width="18"
                                        ></v-img
                                    ></v-col>
                                    <v-col cols="8">{{ item.name }}</v-col>
                                </v-row>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </div>
                <div class="d-flex justify-center mx-3 mt-3">
                    <CurrencySelector></CurrencySelector>
                </div>
            </v-col>
        </v-row>
    </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Watch, Prop } from 'vue-property-decorator';
import Cart from '@/modules/client/cart/components/Cart.vue';
import { authModule, carts, languageModule } from '@/store/namespaces';
import CartMethods from '@/store/carts/methods/cart.methods';
import AuthMethods from '@/store/auth/methods/auth.methods';
import LanguageMethods from '@/store/languages/methods/language.methods';
import { i18n } from '@/i18n/i18n';
import { FETCHED, FETCHING } from '@/config/constants';
import { CustomerInterface } from '@/modules/client/auth/interfaces/customer.interface';
import { CartInterface } from '@/modules/client/cart/interfaces/carts.interface';
import CurrencySelector from '@/modules/currency/components/CurrencySelector.vue';
import SearchBar from '@/modules/common/components/SearchBar.vue';
@Component({
    components: { CurrencySelector, Cart, SearchBar },
})
export default class MobileSidebar extends Vue {
    @Prop() openSideMenu!: boolean;
    readyOpen = false;
    cartDrawer = null;
    dialog = false;
    menu = false;
    message = false;
    hints = true;
    fetching = FETCHING;
    fetched = FETCHED;
    snackbar = false;

    @Watch('openSideMenu')
    drawer(): void {
        this.readyOpen = !this.readyOpen;
    }

    openCart(): void {
        this.readyOpen = false;
        this.$emit('openCart');
    }

    async signOut(): Promise<void> {
        await this.logout();
        this.EMPTY_CART();
        this.$router.push({ name: 'home' });
    }

    goToHome(): void {
        this.$router.currentRoute.path != '/home' ? this.$router.push('/home') : false;
    }

    async mounted(): Promise<void> {
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

<style lang="scss"></style>
