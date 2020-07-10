<template>
    <v-row justify="center">
        <v-col class="container-login" cols="12" lg="4" sm="12" md="6">
            <form class="login100-form validate-form flex-sb flex-w" @submit.prevent="submitLogin">
                <v-row class="logo-header">
                    <img src="../../../../assets/Logo-completo.png" class="logo-header__img" />
                </v-row>
                <div class="buttons">
                    <v-col lg="12" md="12" sm="12">
                        <a
                            href="#"
                            class="btn-signIn btn-signIn__face m-b-20 btn-icons d-flex justify-center"
                            @click="loginWithSocial('facebook')"
                        >
                            <v-icon class="mr-2 icon-face pa-2">fab fa-facebook</v-icon>
                            {{ $t('LOGIN_FACEBOOK') }}
                        </a>
                    </v-col>
                    <v-col lg="12" md="12" sm="12">
                        <a
                            href="#"
                            class="btn-signIn btn-signIn__google m-b-20 btn-icons d-flex justify-center"
                            @click="loginWithSocial('google')"
                        >
                            <v-icon class="mr-2 icon-google pa-2">fab fa-google</v-icon>
                            {{ $t('LOGIN_GOOGLE') }}
                        </a>
                    </v-col>
                </div>
                <span class="login100-form-title pt-4 pb-4">
                    {{ $t('LOGIN_OR') }}
                </span>

                <div class="validate-input mb-4" data-validate="Password is required">
                    <v-text-field :label="$t('EMAIL')" v-model="email"></v-text-field>
                    <span class="focus-input100"></span>
                </div>

                <div class="validate-input mb-2" data-validate="Password is required">
                    <v-text-field
                        :label="$t('PASSWORD')"
                        v-model="password"
                        :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="showPass ? 'text' : 'password'"
                        @click:append="showPass = !showPass"
                    ></v-text-field>

                    <span class="focus-input100"></span>
                </div>
                <div class="mb-4 right">
                    <a href="#" class="txt2 bo1 m-l-5">
                        {{ $t('FORGOT?') }}
                    </a>
                </div>
                <div class="m-t-17 mb-4">
                    <button class="login100-form-btn primary" v-if="isLoading">
                        <v-progress-circular :size="40" color="white" indeterminate></v-progress-circular>
                    </button>
                    <button class="login100-form-btn primary" v-else type="submit">
                        {{ $t('SIGN-IN') }}
                    </button>
                </div>
                <div class="w-full text-center p-t-55">
                    <span class="txt2">
                        {{ $t('NOT-A-MEMBER') }}
                    </span>
                    <RouterLink to="/register" class="txt2 bo1">
                        {{ $t('SIGN-UP-NOW') }}
                    </RouterLink>
                </div>
            </form>
        </v-col>
        <v-snackbar v-model="snackbarError" color="error" class="mb-5 my-5" top>
            <ul>
                <li class="body-1" v-for="error in errors" :key="error.id">
                    {{ error }}
                </li>
            </ul>
            <v-btn color="white" text @click="closeSnack()" small>
                {{ $t('CLOSE') }}
            </v-btn>
        </v-snackbar>
    </v-row>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import AuthMethods from '@/store/auth/methods/auth.methods';
import { authModule, carts } from '@/store/namespaces';
import CartMethods from '@/store/carts/methods/cart.methods';
import { CustomerInterface } from '@/modules/client/auth/interfaces/customer.interface';

@Component
export default class Login extends Vue {
    email = '';
    password = '';
    isLoading = false;
    showPass = false;
    snackbarError = false;
    errors: Array<string> = [];

    @Watch('getErrMessage')
    showErrors(): void {
        this.errors.splice(0);
        if (this.getErrAuth) {
            this.errors.push(this.getErrMessage);
            this.snackbarError = true;
        }
    }
    snackbar = false;

    closeSnack() {
        this.snackbarError = false;
        this.errors.splice(0);
    }

    async loginWithSocial(social: string) {
        await this.loginSocial(social);
        const token: string = this.getToken;
        if (token) {
            this.GET_ITEMS_CARS(this.getClient.id!);
            await this.$router.push('/home');
        }
    }

    async submitLogin() {
        if (this.errors.length > 0) {
            this.showErrors();
        }
        this.isLoading = true;
        await this.login({
            email: this.email,
            password: this.password,
        });
        this.isLoading = false;
        const token: string = this.getToken;
        if (token) {
            this.GET_ITEMS_CARS(this.getClient.id!);
            await this.$router.push('/home');
        }
    }

    @carts.Action(CartMethods.actions.GET_ITEMS_CARS) GET_ITEMS_CARS!: (clientId: number) => boolean;

    @authModule.Getter(AuthMethods.getters.GET_CLIENT_DATA)
    getClient!: CustomerInterface;
    @authModule.Action(AuthMethods.actions.LOGIN_SOCIAL) loginSocial!: (social: string) => boolean;
    @authModule.Action(AuthMethods.actions.LOGIN) login!: (data: CustomerInterface) => boolean;
    @authModule.Getter(AuthMethods.getters.GET_AUTH_TOKEN) getToken!: string;
    @authModule.Getter(AuthMethods.getters.GET_ERR_MESSAGES)
    getErrMessage!: string;
    @authModule.Getter(AuthMethods.getters.GET_ERR_AUTH) getErrAuth!: boolean;
}
</script>

<style scoped lang="scss">
.logo-header {
    display: flex;
    justify-content: center;
    &__img {
        height: 110px;
        width: auto;
    }
}

.icon-facebook {
    color: #ffffff !important;
}

.container-login {
    background: #fff;
    border-radius: 10px;
    padding: 10px 50px;
    box-shadow: -7px 14px 24px 0px rgba(179, 179, 179, 0.44);
}

a {
    font-size: 14px;
    line-height: 1.7;
    color: #666666;
    margin: 0px;
    transition: all 0.4s;
}

.buttons {
    width: 80%;
    align-self: center;
}
a:focus {
    outline: none !important;
}

.txt1 {
    font-size: 16px;
    color: #555555;
    line-height: 1.5;
}

.txt2 {
    font-size: 14px;
    color: #999999;
    text-decoration: none;
    line-height: 1.5;
}

.txt1 {
    font-family: 'Questrial', sans-serif;
}

.bo1 {
    border-bottom: 1px solid #999999;
}

.right {
    justify-self: end;
    align-self: flex-end;
}

.login100-form {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.login100-form-title {
    width: 100%;
    display: block;
    font-family: 'Questrial', sans-serif;
    font-size: 16px;
    color: #555555;
    line-height: 1.2;
    text-align: center;
}

/*------------------------------------------------------------------
    [ Button sign in with ]*/
.btn-signIn {
    color: black;
    line-height: 1.2;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 15px;
    width: 100%;
    height: 35px;
    border-radius: 10px;
    box-shadow: 0 1px 5px 0px rgba(0, 0, 0, 0.2);
    transition: all 0.4s;
    position: relative;
    z-index: 1;

    &__google {
        font-size: 16px;
        font-family: 'Noto Sans JP', sans-serif;
    }

    &__face {
        font-size: 18px;
        font-family: 'PT Sans Narrow', sans-serif;
    }
    &:hover {
        transform: translateY(-2px);
    }
}

.icon-face {
    color: #3b5998 !important;
}

.icon-google {
    color: #db4a39;
}

.btn-icons {
    text-decoration: none;
}

.wrap-input100 {
    width: 100%;
    position: relative;
    background-color: #f7f7f7;
    border: 1px solid #e6e6e6;
    border-radius: 10px;
}

.focus-input100 {
    position: absolute;
    display: block;
    width: calc(100% + 2px);
    height: calc(100% + 2px);
    top: -1px;
    left: -1px;
    pointer-events: none;
    border: 1px solid #fc00ff;
    border-radius: 10px;
    visibility: hidden;
    opacity: 0;
    transition: all 0.4s;
    transform: scaleX(1.1) scaleY(1.3);
}

.input100:focus + .focus-input100 {
    visibility: visible;
    opacity: 1;
    transform: scale(1);
}

.login100-form-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 20px;
    width: 100%;
    height: 40px;
    background-color: #756a44;
    border-radius: 10px;
    font-size: 16px;
    color: #fff;
    line-height: 1.2;
    transition: all 0.4s;
    position: relative;
    z-index: 1;
    outline: none;
}

.login100-form-btn::before {
    content: '';
    display: block;
    position: absolute;
    z-index: -1;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    top: 0;
    left: 0;
    background: #756a44;
    opacity: 0;
    transition: all 0.4s;
    outline: none;
}

.login100-form-btn:hover:before {
    opacity: 1;
}

.login100-form-btn:hover:before {
    opacity: 1;
}

.login100-form-btn:hover:before {
    opacity: 1;
}
</style>
