<template>
    <v-row
            align="center"
            justify="center"
    >
        <v-col
                class="container-login"
                cols="12"
                lg="4"
                sm="12"
                md="6"
        >
            <v-alert
                    v-if="getErrAuth"
                    prominent
                    type="error"
            >
                <v-row align="center">
                    <v-col class="grow">{{getErrMessage}}</v-col>
                </v-row>
            </v-alert>
            <form class="login100-form validate-form flex-sb flex-w" @submit.prevent="submitLogin">
                <v-img src="../../../assets/Logo-completo.png"  class="img-header-form">
                </v-img>
                <span class="login100-form-title p-b-53">
                    {{$t('SIGN-IN-WITH')}}
                </span>
                <div class="row">
                    <v-col lg="12" md="12" sm="12">
                        <a href="#" class="btn-face m-b-20 btn-icons d-flex justify-center"  @click="loginWithSocial('facebook')">
                            <v-icon class="mr-2 icon-facebook pa-2">fab fa-facebook</v-icon>
                            Facebook
                        </a>
                    </v-col>
                    <v-col lg="12" md="12" sm="12">
                        <a href="#" class="btn-google m-b-20 btn-icons d-flex justify-center"  @click="loginWithSocial('google')">
                            <v-icon class="mr-2 icon-google pa-2">fab fa-google</v-icon>
                            Google
                        </a>
                    </v-col>
                </div>
                <span class="login100-form-title pt-4 pb-4">
                    Or
                </span>

                <div class="validate-input mb-4" data-validate = "Password is required">
                    <v-text-field
                            :label="$t('EMAIL')"
                            v-model="email"
                    ></v-text-field>
                    <span class="focus-input100"></span>
                </div>


                <div class=" validate-input mb-4" data-validate = "Password is required">
                    <v-text-field
                            :label="$t('PASSWORD')"
                            v-model="password"
                            :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="showPass ? 'text' : 'password'"
                            @click:append="showPass = !showPass"
                    ></v-text-field>

                    <span class="focus-input100"></span>
                </div>
                <div class="p-t-13 mb-4">
                    <a href="#" class="txt2 bo1 m-l-5">
                        {{$t('FORGOT?')}}
                    </a>
                </div>
                <div class="container-login100-form-btn m-t-17 mb-4">
                    <button class="login100-form-btn primary" v-if="isLoading">
                        <v-progress-circular
                                :size="40"
                                color="white"
                                indeterminate
                        ></v-progress-circular>
                    </button>
                    <button class="login100-form-btn primary" v-else type="submit">
                        {{$t('SIGN-IN')}}
                    </button>
                </div>
                <div class="w-full text-center p-t-55">
                    <span class="txt2">
                        {{$t('NOT-A-MEMBER')}}
                    </span>
                    <RouterLink to="/register" class="txt2 bo1">
                        {{$t('SIGN-UP-NOW')}}
                    </RouterLink>
                </div>
            </form>
        </v-col>
    </v-row>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import AuthMethods from '@/store/auth-module/methods/auth-methods'
    import { authModule, carts } from "@/store/namespaces";
    import CartMethods from "@/store/carts/methods/cart-methods";

    @Component
    export default class Login extends Vue {
        email: string = '';
        password: string = '';
        isLoading: boolean = false;
        showPass: boolean = false;

        async loginWithSocial(social: string){
            await this.loginSocial(social);
            const token: string = this.getToken;
            if(token){
                this.GET_ITEMS_CARS(this.getClient.id);
                await this.$router.push("/home");
            }
        }

        async submitLogin(){
            this.isLoading = true;
            const result = await this.login({email:this.email,password:this.password});
            this.isLoading = false;
            const token: string = this.getToken;
            if(token){
                this.GET_ITEMS_CARS(this.getClient.id);
                await this.$router.push("/home");
            }
        }

        @carts.Action(CartMethods.actions.GET_ITEMS_CARS) GET_ITEMS_CARS;

        @authModule.Getter(AuthMethods.getters.GET_CLIENT_DATA) getClient;
        @authModule.Action(AuthMethods.actions.LOGIN_SOCIAL) loginSocial;
        @authModule.Action(AuthMethods.actions.LOGIN) login;
        @authModule.Getter(AuthMethods.getters.GET_AUTH_TOKEN) getToken;
        @authModule.Getter(AuthMethods.getters.GET_ERR_MESSAGES) getErrMessage;
        @authModule.Getter(AuthMethods.getters.GET_ERR_AUTH)  getErrAuth;
    }
</script>

<style scoped>


    .icon-facebook{
        color: #ffffff !important;
    }

    .container-login{
        background: #fff;
        border-radius: 10px;
        padding: 50px;
    }


    a {
        font-size: 14px;
        line-height: 1.7;
        color: #666666;
        margin: 0px;
        transition: all 0.4s;
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
        line-height: 1.5;
    }

    .txt1{
        font-family: 'Questrial', sans-serif;
    }

    .bo1 {border-bottom: 1px solid #999999;}



    .login100-form {
        width: 100%;
    }

    .login100-form-title {
        width: 100%;
        display: block;
        font-family: 'Questrial', sans-serif;
        font-size: 20px;
        color: #555555;
        line-height: 1.2;
        text-align: center;
    }

    /*------------------------------------------------------------------
    [ Button sign in with ]*/
    .btn-face,
    .btn-google {
        font-size: 18px;
        line-height: 1.2;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 15px;
        width: 100%;
        height: 40px;
        border-radius: 10px;
        box-shadow: 0 1px 5px 0px rgba(0, 0, 0, 0.2);
        transition: all 0.4s;
        position: relative;
        z-index: 1;
    }

    .btn-face{
        color: #3b5998;
        background: none;
    }

    .btn-face i{
        color: #3b5998 !important;
    }

    .btn-google i {
        color: #db4a39;
    }

    .btn-face::after {
        display: block;
        position: absolute;
        z-index: -1;
        width: 100%;
        height: 100%;
        border-radius: 10px;
        top: 0;
        left: 0;
        opacity: 0;
        transition: all 0.4s;
    }

    .btn-icons {
        text-decoration: none;
    }

    .btn-face i {
        font-size: 30px;
        margin-right: 17px;
    }

    .btn-google {
        color: #555555;
        background-color: #fff;
    }


    .btn-face:hover:before,
    .btn-google:hover:before {
        opacity: 1;
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

    .container-login100-form-btn {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
    }

    .login100-form-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 20px;
        width: 100%;
        height: 40px;
        background-color: #F1CABB;
        border-radius: 10px;
        font-size: 16px;
        color: #fff;
        line-height: 1.2;
        transition: all 0.4s;
        position: relative;
        z-index: 1;
    }

    .login100-form-btn::before {
        content: "";
        display: block;
        position: absolute;
        z-index: -1;
        width: 100%;
        height: 100%;
        border-radius: 10px;
        top: 0;
        left: 0;
        background: #F1CABB;
        opacity: 0;
        transition: all 0.4s;
    }

    .login100-form-btn:hover:before {
        opacity: 1;
    }

</style>
