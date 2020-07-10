<template>
    <div class="container-page">
        <v-img src="../../../../assets/images/home.jpg" height="200" class="grey darken-4"></v-img>
        <div class="title-1 mt-6">
            {{ $t('WELCOME_ADMIN') }}!
            <div class="line"></div>
        </div>
        <v-row class="d-flex align-center mx-3 mt-12">
            <v-col>
                <p class="mb-0 overline text-center">Partner</p>
                <div class="line mb-3"></div>
                <div class="d-flex justify-center">
                    <v-card height="200" width="300" class="d-flex justify-center pa-3">
                        <v-img src="../../../../assets/petromiles.png" contain></v-img>
                    </v-card>
                </div>
            </v-col>
            <v-col>
                <p class="mb-0 overline text-center">Buhocenter</p>
                <div class="line mb-3"></div>
                <div class="d-flex justify-center">
                    <v-card height="250" width="300" class="d-flex justify-center pa-3">
                        <v-img src="../../../../assets/logo-header.png" contain></v-img>
                    </v-card>
                </div>
            </v-col>
            <v-col>
                <p class="mb-0 overline text-center">Partner</p>
                <div class="line mb-3"></div>
                <div class="d-flex justify-center">
                    <v-card height="200" width="300" class="d-flex justify-center mr-0">
                        <v-img src="../../../../assets/shipThis.jpeg" contain></v-img>
                    </v-card>
                </div>
            </v-col>
        </v-row>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component
export default class DashboardHome extends Vue {}
</script>
<style>
.container-page {
    width: 100%;
}
.v-image__image--contain {
    background-position-y: 38% !important;
}

@media only screen and (max-width: 600px) {
    .v-window__prev,
    .v-window__next {
        top: calc(40% - 20px) !important;
    }
}
</style>
