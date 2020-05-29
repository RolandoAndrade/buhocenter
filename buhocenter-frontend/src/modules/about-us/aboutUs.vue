<template>
    <div style="background: #f3f3f3;">
        <v-container class="mt-8" >
            <h3 class="text-center">{{$t('ABOUT_US').toUpperCase()}}</h3>
            <v-row dense>
                <v-col
                        cols="12"
                        lg="4"
                        md="4"
                        sm="12"
                        xs="12"
                        class="mb-2"
                        style="padding: 30px;"
                >
                    <v-card
                            class="mx-auto"
                            style="padding: 30px;"
                            max-width="344"

                    >
                        <v-card-title class="justify-center">
                            <v-icon style="font-size: 40px;" color="secondary">fab fa-bitcoin</v-icon>
                        </v-card-title>

                        <v-card-title class="justify-center ">
                            {{$t('PAY_CRYPTOCURRENCIES')}}
                        </v-card-title>

                        <v-card-subtitle class="justify-center text-center ">
                            {{$t('PAY_CRYPTOCURRENCIES_INFO')}}
                        </v-card-subtitle>

                        <v-card-actions class="justify-center">
                            <RouterLink to="/sign-in" style="text-decoration: none;"><v-btn  color="primary">{{$t('SIGN-IN')}}</v-btn></RouterLink>
                        </v-card-actions>


                    </v-card>
                </v-col>
                <v-col
                        cols="12"
                        lg="4"
                        md="4"
                        sm="12"
                        xs="12"
                        class="mb-2"
                        style="padding: 30px;"
                >
                    <v-card
                            class="mx-auto"
                            style="padding: 30px;"
                            max-width="344"

                    >
                        <v-card-title class="justify-center">
                            <v-icon style="font-size: 40px;" color="secondary">fas fa-shopping-cart</v-icon>
                        </v-card-title>

                        <v-card-title class="justify-center ">
                            {{$t('BIG_ECOMMERCE')}}
                        </v-card-title>

                        <v-card-subtitle class="justify-center text-center ">
                            {{$t('BIG_ECOMMERCE_INFO')}}
                        </v-card-subtitle>

                        <v-card-actions class="justify-center">

                            <RouterLink to="/sign-in" style="text-decoration: none;">
                                <v-btn  color="primary"> {{$t('GO_SHOPPING')}}</v-btn>
                            </RouterLink>
                        </v-card-actions>


                    </v-card>
                </v-col>
                <v-col
                        cols="12"
                        lg="4"
                        md="4"
                        sm="12"
                        xs="12"
                        class="mb-2"
                        style="padding: 30px;"
                >
                    <v-card
                            class="mx-auto"
                            style="padding: 30px;"
                            max-width="344"

                    >
                        <v-card-title class="justify-center">
                            <v-icon style="font-size: 40px;" color="secondary">fas fa-globe</v-icon>
                        </v-card-title>

                        <v-card-title class="justify-center ">
                            {{$t('MULTI_LANGUAGE_SITE')}}
                        </v-card-title>

                        <v-card-subtitle class="justify-center text-center ">
                            {{$t('MULTI_LANGUAGE_SITE_INFO')}}
                        </v-card-subtitle>

                        <v-card-actions class="justify-center">

                            <v-btn  color="primary">{{$t('SIGN-IN')}}</v-btn>
                        </v-card-actions>



                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from "vue-class-component";

    @Component
    export default class AboutUs extends Vue {
        show:boolean = true;

    }
</script>
