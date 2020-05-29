<template>
    <v-container fluid class="mt-5" style="max-width: none !important;">
        <v-img
                src="../../../assets/images/account.jpg"
                height="125"
                class="grey darken-4"
        ></v-img>
        <v-container class="mt-5" style="max-width: none !important;">
            <div class="overline text-center mb-8">
                {{$t('YOUR_ACCOUNT')}}
            </div>
            <v-row class="mx-auto my-2" fill-width>
                <v-col
                    xs="10"
                    sm="12"
                    md="4"
                    lg="2"
                    class=" align-content-center justify-center pa-0"
                    v-for="(item,index) in items"
                    :key="item.title"
                    :offset-lg="index === 0? 1:null"
                >
                    <v-card color="white" class="mb-5 mx-2 ma-0" :to="item.link" v-if="!item.admin" >
                        <div class="container" style="height: 320px;">
                            <v-card-title class="row d-flex justify-center">
                                <v-avatar
                                        class="ma-3"
                                        size="80"
                                        tile
                                >
                                    <v-img :src="item.src"></v-img>
                                </v-avatar>
                            </v-card-title>
                            <v-card-title  class="row d-flex justify-center text-center"
                            >{{$t(item.title)}}
                            </v-card-title>
                            <v-card-subtitle class="row d-flex justify-center text-center">{{$t(item.subtitle)}}</v-card-subtitle>


                        </div>
                    </v-card>
                    <v-card color="white" class="mb-5 mx-2 ma-0"  style="cursor:pointer;" v-else-if="getClient.role.id === rol.ADMIN">
                        <div class="container" @click="redirectDashboard()" style="height: 320px;">
                            <v-card-title class="row d-flex justify-center">
                                <v-avatar
                                        class="ma-3"
                                        size="80"
                                        tile
                                >
                                    <v-img :src="item.src"></v-img>
                                </v-avatar>
                            </v-card-title>
                            <v-card-title  class="row d-flex justify-center text-center mb-2" style="width: auto;word-break: break-word;"
                            >{{$t(item.title)}}
                            </v-card-title>
                            <v-card-subtitle class="row d-flex justify-center text-center">{{$t(item.subtitle)}}</v-card-subtitle>
                        </div>
                    </v-card>

                </v-col>
            </v-row>
        </v-container>
    </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {authModule} from "@/store/namespaces";
import AuthMethods from "@/store/auth-module/methods/auth-methods";
import {ROL} from '@/config/constants';

@Component
export default class Profile extends Vue {

    items = [
        {
            src: require('../assets/orders.png'),
            title: "YOUR_ORDERS",
            subtitle: "YOUR_ORDERS_INFO",
            admin: false,
            link: "#",
        },
        {
            src: require('../assets/login.png'),
            title: "YOUR_PROFILE",
            subtitle: "YOUR_PROFILE_INFO",
            admin: false,
            link: "/your-account",
        },
        {
            src: require('../assets/address.png'),
            title: "YOUR_ADDRESSES",
            subtitle: "YOUR_ADDRESSES_INFO",
            admin: false,
            link: "/address-management",
        },
        {
            src: require('../assets/invoice.jpg'),
            title: "YOUR_INVOICES",
            subtitle: "YOUR_INVOICES_INFO",
            admin: false,
        },
        {
            src: require('../assets/platform.png'),
            title: "PLATFORM_ADMINISTRATE",
            subtitle: "PLATFORM_ADMINISTRATE_INFO",
            admin: true,
            link: "#",
        },
    ]
    rol = ROL;



    redirectDashboard(){
        this.$router.push('/dashboard');
    }

    mounted(){
        console.log(this.getClient)
    }

    @authModule.Getter(AuthMethods.getters.GET_CLIENT_DATA) getClient;
}
</script>