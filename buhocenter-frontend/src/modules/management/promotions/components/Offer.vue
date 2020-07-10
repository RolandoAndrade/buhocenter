<template>
    <v-card outlined class="my-3 mx-12">
        <v-row class="align-center">
            <v-col cols="10">
                <v-list-item three-line>
                    <v-list-item-content>
                        <div class="overline mb-4">{{ offer.name }}</div>
                        <v-list-item-title class="headline mb-1">{{ offer.percentage }}%</v-list-item-title>
                        <v-list-item-subtitle>{{ offer.description }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-col>
            <v-col cols="2" class="justify-center">
                <v-btn text class="error" small :loading="loading" @click="deleteOffer(offer.id)">{{
                    $t('REMOVE')
                }}</v-btn>
            </v-col>
        </v-row>
    </v-card>
</template>
<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';
import { Offers } from '@/modules/management/promotions/interfaces/offers.interface';
import { offers } from '@/store/namespaces';
import OffersTypes from '@/store/offers/methods/offers.methods';

@Component
export default class Offer extends Vue {
    @Prop() offer!: Offers;
    loading: boolean = false;

    async deleteOffer(offerId: number): Promise<void> {
        this.loading = true;
        await this.DELETE_OFFER(offerId);
        this.loading = false;
        this.$emit('refreshOffers');
    }

    @offers.Action(OffersTypes.actions.DELETE_OFFERS)
    private DELETE_OFFER!: (offerId: number) => boolean;
}
</script>
<style></style>
