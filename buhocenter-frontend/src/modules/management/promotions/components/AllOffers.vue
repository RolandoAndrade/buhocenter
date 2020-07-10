<template>
    <div>
        <OfferBox
            v-for="offer in OFFERS"
            :key="offer.id"
            v-bind:offer="offer"
            @refreshOffers="refreshOffers"
        />
        <v-alert
            type="info"
            elevation="1"
            class="my-3 mx-12"
            color="blue darken-1"
            dense
            :value="showAlert"
            transition="slide-x-transition"
        >
            {{ $t('EMPTY_OFFERS') }}
        </v-alert>
        <v-pagination v-model="page" :length="totalPages" class="mt-12" v-if="showPagination"></v-pagination>
        <v-snackbar v-model="offerDeleted" top color="success" class="mt-12">
            {{ $t('OFFER_REMOVED') }}
            <v-btn color="white" text @click="offerDeleted = false">{{ $t('CLOSE') }}</v-btn>
        </v-snackbar>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import OfferBox from './Offer.vue';
import { offers } from '@/store/namespaces';
import { Offer } from '../interfaces/offer.interface';
import OffersTypes from '@/store/offers/methods/offers.methods';

@Component({
    components: {
        OfferBox,
    },
})
export default class AllOffers extends Vue {
    offerDeleted: boolean = false;
    page: number = 1;
    start: number = 0;
    limit: number = 10;

    mounted(): void {
        this.FETCH_OFFERS({ start: this.start, limit: this.limit });
    }

    refreshOffers(): void {
        this.offerDeleted = true;
        this.FETCH_OFFERS({ start: this.start, limit: this.limit });
    }

    @Watch('page')
    async setPagination(page: number): Promise<void> {
        this.start = (page - 1) * 10;
        await this.FETCH_OFFERS({ start: this.start, limit: this.limit });
    }

    get showPagination(): boolean {
        return this.QUANTITY > 0 ? true : false;
    }

    get showAlert(): boolean {
        return this.OFFERS.length > 0 ? false : true;
    }

    get totalPages(): number {
        if (this.QUANTITY / 10 > Math.round(this.QUANTITY / 10)) {
            return Math.round(this.QUANTITY / 10) + 1;
        } else {
            return Math.round(this.QUANTITY / 10);
        }
    }

    @offers.Action(OffersTypes.actions.FETCH_OFFERS)
    private FETCH_OFFERS!: (payload: { start: number; limit: number }) => boolean;

    @offers.Getter(OffersTypes.getters.GET_OFFERS)
    private OFFERS!: Offer[];
    @offers.Getter(OffersTypes.getters.GET_QUANTITY)
    private QUANTITY!: number;
}
</script>
<style></style>
