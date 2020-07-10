<template>
    <v-container fluid class="mt-5" style="max-width: none !important;">
        <v-img src="../../../../assets/images/account.jpg" height="125" class="grey darken-4"></v-img>
        <v-container class="mt-5" style="max-width: none !important;">
            <div class="title-2 mb-8">
                {{ $t('MY_ACCOUNT') }}
                <div class="line"></div>
            </div>
            <v-row class="mx-auto my-2" fill-width>
                <v-col
                    class="d-flex align-content-center justify-center pa-0 flex-wrap"
                    v-if="getClient.role.id !== rol.ADMIN"
                >
                    <span v-for="item in items" :key="item.title">
                        <v-card
                            v-if="!item.admin"
                            color="white"
                            class="mb-5 mx-2 ma-0"
                            width="200"
                            @click="redirect(item.link)"
                        >
                            <div class="container" style="height: 320px;">
                                <v-card-title class="row d-flex justify-center">
                                    <v-avatar class="ma-3" size="80" tile>
                                        <v-img :src="item.src"></v-img>
                                    </v-avatar>
                                </v-card-title>
                                <v-card-title class="row d-flex justify-center text-center">
                                    {{ $t(item.title) }}
                                </v-card-title>
                                <v-card-subtitle class="row d-flex justify-center text-center">{{
                                    $t(item.subtitle)
                                }}</v-card-subtitle>
                            </div>
                        </v-card>
                    </span>
                </v-col>
                <v-col
                    class="d-flex align-content-center justify-center pa-0 flex-wrap"
                    v-if="getClient.role.id === rol.ADMIN"
                >
                    <span v-for="item in items" :key="item.title">
                        <v-card
                            color="white"
                            class="mb-5 mx-2 ma-0"
                            style="cursor: pointer;"
                            width="200"
                            v-if="getClient.role.id === rol.ADMIN"
                        >
                            <div class="container" @click="redirect(item.link)" style="height: 320px;">
                                <v-card-title class="row d-flex justify-center">
                                    <v-avatar class="ma-3" size="80" tile>
                                        <v-img :src="item.src"></v-img>
                                    </v-avatar>
                                </v-card-title>
                                <v-card-title
                                    class="row d-flex justify-center text-center mb-2"
                                    style="width: auto; word-break: break-word;"
                                    >{{ $t(item.title) }}</v-card-title
                                >
                                <v-card-subtitle class="row d-flex justify-center text-center">{{
                                    $t(item.subtitle)
                                }}</v-card-subtitle>
                            </div>
                        </v-card>
                    </span>
                </v-col>
            </v-row>
        </v-container>
        <v-dialog v-model="modal" scrollable max-width="450px">
            <v-card class="pa-4" height="max-content">
                <v-img class="ma-auto mt-6 mb-6" src="../../../../assets/petromiles.png" width="50" />
                <div class="petromiles-container" v-if="!userVerified">
                    <div v-if="!petromilesAuth">
                        <div class="title-2">{{ $t('TYPE_PETROMILES_ACCOUNT') }}</div>
                        <input
                            class="input-petromiles input-petromiles__account"
                            :placeholder="$t('YOUR_PETROMILES_ACCOUNT') + '...'"
                            type="email"
                            v-model="userPetromiles"
                        />
                        <v-btn
                            class="button-petromiles button-petromiles__big mt-6 mb-6"
                            :loading="loading"
                            @click="fetchAuthorize()"
                        >
                            {{ $t('CONTINUE') }}
                        </v-btn>
                    </div>
                    <div v-if="petromilesAuth">
                        <div class="title-2">{{ $t('PETROMILES_VERIFICATION_CODE') }}</div>
                        <div class="code-container mt-6 mb-6">
                            <input
                                class="input-petromiles input-petromiles__code"
                                :placeholder="$t('TYPE_CODE')"
                                type="number"
                                v-model="userCode"
                            />
                            <v-btn
                                class="button-petromiles button-petromiles__small"
                                :loading="loadingCode"
                                @click="fetchAuthorizeCode()"
                            >
                                {{ $t('READY') }}
                            </v-btn>
                        </div>
                        <div class="d-flex justify-center">
                            <p class="mb-0 red--text">
                                {{ $t('ATTEMPTS_P1') }} {{ retry }} {{ $t('ATTEMPTS_P2') }}
                            </p>
                        </div>
                    </div>
                    <div v-if="!petromilesAuth">
                        <p class="mt-6">{{ $t('NO_PETROMILES_ACCOUNT') }}</p>
                        <a
                            href="https://petromiles-frontend.herokuapp.com/sign-up"
                            target="_blank"
                            class="link-petromiles"
                            >{{ $t('CREATE_PETROMILES_ACCOUNT') }}</a
                        >
                    </div>
                </div>
                <div v-if="userVerified" class="pa-3">
                    <div class="d-flex justify-center align-center mb-12">
                        <p class="title-2 mb-0 mx-1">{{ $t('PETROMILES_VERIFY') }}</p>
                        <v-icon color="success" class="mx-1">mdi-check-circle-outline</v-icon>
                    </div>
                    <div>
                        <div class="d-flex justify-center align-center">
                            <p class="text-center my-0 mx-1">
                                {{ $t('QUESTION_UNLINK_PETROMILES_ACCOUNT') }}
                            </p>
                            <v-btn
                                class="button-petromiles button-petromiles__big"
                                :loading="loadingUnlink"
                                @click="unlinkAccount"
                                >{{ $t('PETROMILES_UNLINK') }}</v-btn
                            >
                        </div>
                    </div>
                </div>
            </v-card>
        </v-dialog>
        <v-snackbar v-model="loginSuccess" top color="success" class="mt-12">
            {{ $t('PETROMILES_SUCCESS') }}
            <v-btn color="white" text @click="loginSuccess = false">{{ $t('CLOSE') }}</v-btn>
        </v-snackbar>
        <v-snackbar v-model="loginDesSuccess" top color="success" class="mt-12">
            {{ $t('PETROMILES_UNLINK_SUCCESS') }}
            <v-btn color="white" text @click="loginDesSuccess = false">{{ $t('CLOSE') }}</v-btn>
        </v-snackbar>
        <v-snackbar v-model="loginError" top color="error" class="mt-12">
            {{ $t('PETROMILES_ERROR') }}
            <v-btn color="white" text @click="loginError = false">{{ $t('CLOSE') }}</v-btn>
        </v-snackbar>
    </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { authModule, thirdParty } from '@/store/namespaces';
import AuthMethods from '@/store/auth/methods/auth.methods';
import ThirdPartyMethods from '@/store/third-party/methods/third-party.methods';
import { ROL } from '@/config/constants';
import { CustomerInterface } from '@/modules/client/auth/interfaces/customer.interface';
import { PetromilesAuth } from '@/modules/third-party/interfaces/petromilesAuth.interface';

@Component
export default class Profile extends Vue {
    modal: boolean = false;
    petromilesAuth: boolean = false;
    loginSuccess: boolean = false;
    loginError: boolean = false;
    loginDesSuccess: boolean = false;
    userPetromiles: string = '';
    userCode: string = '';
    userVerified: boolean = false;
    retry: number = 3;
    loading: boolean = false;
    loadingCode: boolean = false;
    loadingUnlink: boolean = false;
    items = [
        {
            src: require('../../../../assets/orders.png'),
            title: 'MY_ORDERS',
            subtitle: 'YOUR_ORDERS_INFO',
            admin: false,
            link: '/your-orders',
        },
        {
            src: require('../../../../assets/login.png'),
            title: 'MY_PROFILE',
            subtitle: 'YOUR_PROFILE_INFO',
            admin: false,
            link: '/your-account',
        },
        {
            src: require('../../../../assets/address.png'),
            title: 'MY_ADDRESSES',
            subtitle: 'YOUR_ADDRESSES_INFO',
            admin: false,
            link: '/address-management',
        },
        {
            src: require('../../../../assets/petromiles.png'),
            title: 'PetroMiles',
            subtitle: 'PARTNER_PETROMILES',
            admin: false,
            link: '/petromiles',
        },
        {
            src: require('../../../../assets/platform.png'),
            title: 'PLATFORM_ADMINISTRATE',
            subtitle: 'PLATFORM_ADMINISTRATE_INFO',
            admin: true,
            link: '/dashboard',
        },
    ];
    rol = ROL;

    redirect(link: string): void {
        if (link === '/petromiles') {
            this.modal = true;
        } else {
            this.$router.push(link);
        }
    }

    async fetchAuthorize(): Promise<void> {
        this.loading = true;
        const petromiles: PetromilesAuth = {
            id: undefined,
            fidelityUserEmail: this.userPetromiles,
            userCode: undefined,
        };
        if (await this.FETCH_AUTHORIZE(petromiles)) {
            this.petromilesAuth = true;
        } else {
            this.modal = false;
            this.loginError = true;
        }
        this.loading = false;
    }

    async fetchAuthorizeCode(): Promise<void> {
        this.loadingCode = true;
        const petromiles: PetromilesAuth = {
            id: this.getClient.id!,
            fidelityUserEmail: this.userPetromiles,
            userCode: this.userCode,
        };
        if (await this.FETCH_AUTHORIZE_CODE(petromiles)) {
            this.petromilesAuth = true;
            this.userCode = '';
            this.userVerified = true;
            this.modal = false;
            this.loginSuccess = true;
        } else {
            if (this.retry > 1 && this.retry <= 3) {
                this.retry--;
            } else {
                this.retry = 3;
                this.petromilesAuth = false;
                this.userCode = '';
                this.userVerified = false;
                this.modal = false;
                this.loginError = true;
            }
        }
        this.loadingCode = false;
    }

    async unlinkAccount(): Promise<void> {
        this.loadingUnlink = true;
        const unlink = {
            id: this.getClient.id!,
            fidelityUserEmail: null,
            loyaltySystemToken: null,
        };
        if (await this.UNLINK_USER(unlink)) {
            this.petromilesAuth = false;
            this.userCode = '';
            this.userVerified = false;
            this.modal = false;
            this.loginDesSuccess = true;
        } else {
            this.modal = false;
            this.loginDesSuccess = false;
        }
        this.loadingUnlink = false;
    }

    async mounted(): Promise<void> {
        this.userPetromiles = this.getClient.email!;
        const petromiles: PetromilesAuth = {
            id: this.getClient.id!,
            fidelityUserEmail: undefined,
            userCode: undefined,
        };
        if (await this.VERIFY_USER(petromiles)) {
            this.userVerified = true;
        }
    }

    @authModule.Getter(AuthMethods.getters.GET_CLIENT_DATA)
    getClient!: CustomerInterface;

    @thirdParty.Action(ThirdPartyMethods.actions.FETCH_AUTHORIZE)
    private FETCH_AUTHORIZE!: (petromiles: PetromilesAuth) => boolean;

    @thirdParty.Action(ThirdPartyMethods.actions.FETCH_AUTHORIZE_CODE)
    private FETCH_AUTHORIZE_CODE!: (petromiles: PetromilesAuth) => boolean;

    @thirdParty.Action(ThirdPartyMethods.actions.VERFIFY_USER)
    private VERIFY_USER!: (petromiles: PetromilesAuth) => boolean;

    @thirdParty.Action(ThirdPartyMethods.actions.UNLINK_USER)
    private UNLINK_USER!: (petromiles: {
        id: number;
        fidelityUserEmail: null;
        loyaltySystemToken: null;
    }) => boolean;
}
</script>

<style scoped lang="scss">
.input-petromiles {
    border: 2px solid #113a6e;
    height: 50px;
    outline: none;
    border-radius: 3px;
    transition: all 0.3s;
    padding: 10px;
    &:focus {
        border: 2px solid #fcb522;
    }
    &__account {
        margin: 10px auto;
        align-self: center;
        width: 70%;
    }
    &__code {
        width: 40%;
    }
}
.code-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 0 20px;
}
.petromiles-container {
    text-align: center;
}
.button-petromiles {
    border: 2px solid #fcb522 !important;
    background-color: #fcb522 !important;
    border-radius: 10px !important;
    color: #113a6e !important;
    height: 50px !important;
    outline: none !important;
    transition: all 0.3s !important;
    &:hover {
        border: 2px solid #e49800 !important;
        background-color: #e49800 !important;
    }

    &__big {
        margin: 10px auto !important;
        width: 50% !important;
    }

    &__small {
        width: 40% !important;
    }
}
.link-petromiles {
    color: #113a6e;
}
@media only screen and (max-width: 400px) {
    .code-container {
        display: column;
        padding: 0;
    }
    .button-petromiles {
        width: 100%;
    }
    .input-petromiles__account {
        width: 100%;
    }
    .input-petromiles__code {
        width: 70%;
        margin: 10px auto 15px auto;
    }
}
</style>
