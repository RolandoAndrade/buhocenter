<template>
    <v-container>
        <v-row>
            <v-col class="d-flex justify-center">
                <h2>{{ $t('OFFERS') }}</h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-card outlined class="my-3 mx-12 pa-3 d-flex justify-space-between align-center">
                    <div class="d-flex justify-center align-center">
                        <p class="my-0 mx-3">{{ $t('OFFERS') }} ({{ totalOffers }})</p>
                        <v-divider vertical></v-divider>
                    </div>
                    <v-btn
                        color="primary"
                        dark
                        class="mb-2"
                        @click="() => goToCreateOffer()"
                        v-if="createOffer"
                        >{{ $t('NEW_OFFER') }}</v-btn
                    >
                    <v-btn
                        color="primary"
                        dark
                        class="mb-2"
                        @click="() => goToAllOffers()"
                        v-if="allOffers"
                        >{{ $t('BACK_TO_OFFERS') }}</v-btn
                    >
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <router-view></router-view>
            </v-col>
        </v-row>
    </v-container>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { offers } from '@/store/namespaces';
import OffersTypes from '@/store/offers/methods/offers.methods';

@Component
export default class DashboardOffers extends Vue {
    allOffers: boolean = false;
    createOffer: boolean = false;

    mounted(): void {
        if (this.$router.currentRoute.path == '/dashboard/promotions/create') {
            this.allOffers = true;
            this.createOffer = false;
        } else {
            this.createOffer = true;
            this.allOffers = false;
        }
    }

    goToCreateOffer(): void {
        this.allOffers = true;
        this.createOffer = false;
        this.$router.currentRoute.path != '/dashboard/promotions/create'
            ? this.$router.push('/dashboard/promotions/create')
            : false;
    }

    goToAllOffers(): void {
        this.createOffer = true;
        this.allOffers = false;
        this.$router.currentRoute.path != '/dashboard/promotions/all'
            ? this.$router.push('/dashboard/promotions/all')
            : false;
    }

    get totalOffers(): number {
        return this.QUANTITY;
    }

    @offers.Getter(OffersTypes.getters.GET_QUANTITY)
    private QUANTITY!: number;
}
</script>
<style></style>
