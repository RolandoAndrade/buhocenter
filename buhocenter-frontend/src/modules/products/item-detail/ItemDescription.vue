z<template>
    <v-col class="mr-3 font-weight-light align-center pa-0 caption">
        <p v-if="isProduct()" class="title ma-0">{{ GET_ITEM_DETAIL.brand.name }}</p>
        <p class="subtitle-1 my-0 mr-3">{{ GET_ITEM_DETAIL.name }}</p>
        <v-row class="mx-auto d-flex align-center">
            <v-rating
                :value="getRatings"
                background-color="orange lighten-3"
                color="orange"
                small
                readonly
                size="10"
                half-increments
                dense
            ></v-rating>
            <p class="px-2 my-0 body-2 align-center"> 
                ({{ getTotalRatings }})
            </p>
        </v-row>
        <h3 class="body-2"> {{$t('PRICE')}}:
            <span :class="{ 'title': true, 'item-offer__title': hasOffer() }">${{ GET_ITEM_DETAIL.price }}</span>
            <span v-if="hasOffer()" class="title"> ${{ getDiscountPrice() }} </span>
        </h3>
        <v-row class="mx-auto d-flex align-center">
            <h3>{{$t('BY')}}: </h3>
            <div>
                <p class="body-1 mx-2 my-0"> {{ getProvider() }} </p>
            </div>
        </v-row>
        <v-row class="mx-auto d-flex align-center">
            <h3 class="mr-2">{{$t('DESCRIPTION')}}: </h3>
            <div>
                <p class="body-1 my-0"> {{ GET_ITEM_DETAIL.description }} </p>
            </div>
        </v-row>
        <v-row v-if="isProduct()" class="mx-auto d-flex align-center">
            <h3>{{$t('IN_STOCK')}}: </h3>
            <p class="body-1 mx-2 my-0"> {{ this.GET_ITEM_DETAIL.productInventories[0].availableQuantity }} </p>
        </v-row>
        <v-row v-if="isProduct()" class="mx-auto d-flex align-center">
            <h3>{{$t('PRODUCT_DIMENSIONS')}}: </h3>
            <p class="body-1 mx-2 my-0"> {{ productDimensions }} inches </p>
        </v-row>
    </v-col>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { products } from "@/store/namespaces";
import {
    GET_ITEM_DETAIL,
} from '@/store/products/methods/products.getters';
import { STATUS } from '@/config/constants';

@Component
export default class ItemDescription extends Vue {

    isProduct(): boolean {
        return this.$route.query.item === 'product';
    }

    get getAvailableQuantity(): number {
        if (this.isProduct()) {
            return this.GET_ITEM_DETAIL.productInventories[0].availableQuantity
        }

        return 0;
    }

    get getTotalRatings(): number {
        if (this.isProduct()) {
            return this.GET_ITEM_DETAIL.productRatings ? this.GET_ITEM_DETAIL.productRatings[0].total : 0;
        }

        return this.GET_ITEM_DETAIL.serviceRatings ? this.GET_ITEM_DETAIL.serviceRatings[0].total : 0;
    }

    get getRatings(): number {
        if (this.isProduct()) {
            return parseFloat(this.GET_ITEM_DETAIL.productRatings ? this.GET_ITEM_DETAIL.productRatings[0].rating : 0);
        }

        return parseFloat(this.GET_ITEM_DETAIL.serviceRatings ? this.GET_ITEM_DETAIL.serviceRatings[0].rating : 0);
    }

    get productDimensions(): string {
        const width: string = this.GET_ITEM_DETAIL.productDimensions.width;
        const height: string = this.GET_ITEM_DETAIL.productDimensions.height;
        const long: string = this.GET_ITEM_DETAIL.productDimensions.long;

        return `${long} x ${width} x ${height}`;
    }

    getProvider(): string {
        if (this.isProduct()) {
            return this.GET_ITEM_DETAIL.productProvider[0].provider.name;
        } else {
            return this.GET_ITEM_DETAIL.serviceProvider[0].provider.name;
        }

    }

    getDiscountPrice(): string {
        let discountPrice: string = '';

        this.GET_ITEM_DETAIL.offers.forEach((element) => {
            if (element.offer.status.id === STATUS.ACTIVE) {
                discountPrice = element.discountPrice;
            }
        });

        return discountPrice;
    }

    hasOffer() {
        if (this.GET_ITEM_DETAIL.offers) {
            return this.GET_ITEM_DETAIL.offers.some((element) => element.offer.status.id === STATUS.ACTIVE);
        }

        return false;
    }

    @products.Getter(GET_ITEM_DETAIL) GET_ITEM_DETAIL;
}
</script>

<style scoped>
.item-offer__title {
    text-decoration: line-through;
}
</style>