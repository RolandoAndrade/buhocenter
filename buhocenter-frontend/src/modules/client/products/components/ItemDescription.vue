<template>
    <v-col class="mr-3 font-weight-light align-center pa-0 caption">
        <p v-if="isProduct()" class="title ma-0">
            {{ GET_ITEM_DETAIL.brand.name }}
        </p>
        <p class="subtitle-1 my-0 mr-3">{{ GET_ITEM_DETAIL.name }}</p>
        <v-row class="mx-auto d-flex align-center">
            <v-rating
                :value="getRatings()"
                background-color="orange lighten-3"
                color="orange"
                small
                readonly
                size="10"
                half-increments
                dense
            ></v-rating>
            <p class="px-2 my-0 body-2 align-center">({{ getTotalRatings() }})</p>
        </v-row>
        <h3 class="body-2">
            {{ $t('PRICE') }}:
            <span :class="{ title: true, 'item-offer__title': hasOffer() }">{{
                GET_ITEM_DETAIL.price | getCurrentExchangeWithSymbolFor
            }}</span>
            <span v-if="hasOffer()" class="title"> ${{ getDiscountPrice() }} </span>
        </h3>
        <v-row class="mx-auto d-flex align-center">
            <h3>{{ $t('BY') }}:</h3>
            <div>
                <p class="body-1 mx-2 my-0">{{ getProvider() }}</p>
            </div>
        </v-row>
        <v-row class="mx-auto d-flex align-center">
            <h3 class="mr-2">{{ $t('DESCRIPTION') }}:</h3>
            <div>
                <p class="body-1 my-0">{{ GET_ITEM_DETAIL.description }}</p>
            </div>
        </v-row>
        <v-row v-if="isProduct()" class="mx-auto d-flex align-center">
            <v-col style="display: flex; align-items: center;">
                <h3>{{ $t('IN_STOCK') }}:</h3>
                <p class="body-1 mx-2 my-0">
                    {{ this.GET_ITEM_DETAIL.productInventory.availableQuantity }}
                </p>
            </v-col>
            <v-col v-if="this.GET_ITEM_DETAIL.tentativePoints" style="display: flex; align-items: center;">
                <img src="@/assets/petromiles.png" class="mr-2" style="width: 25px;" />
                <p class="body-1 mx-2 my-0">{{ this.GET_ITEM_DETAIL.tentativePoints }} pts</p>
            </v-col>
        </v-row>
        <v-row v-if="isProduct()" class="mx-auto d-flex align-center">
            <h3>{{ $t('PRODUCT_DIMENSIONS') }}:</h3>
            <p class="body-1 mx-2 my-0">{{ productDimensions }} cm</p>
        </v-row>
    </v-col>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { products } from '@/store/namespaces';
import ProductsTypes from '@/store/products/methods/products.methods';
import { STATUS } from '@/config/constants';
import { Product } from '@/modules/client/products/interfaces/products.interface';

@Component
export default class ItemDescription extends Vue {
    isProduct(): boolean {
        return this.$route.query.item === 'product';
    }

    getTotalRatings(): number | undefined {
        if (this.isProduct()) {
            return parseInt(this.GET_ITEM_DETAIL.rating!);
        }
    }

    getRatings(): number | undefined {
        if (this.isProduct()) {
            return parseInt(this.GET_ITEM_DETAIL.rating!);
        }
    }

    get productDimensions(): string {
        const width = this.GET_ITEM_DETAIL.productDimension!.width;
        const height = this.GET_ITEM_DETAIL.productDimension!.height;
        const long = this.GET_ITEM_DETAIL.productDimension!.long;
        return `${long} x ${width} x ${height}`;
    }

    getProvider(): string | undefined {
        if (this.isProduct()) {
            return this.GET_ITEM_DETAIL.provider!.name;
        }
    }

    getDiscountPrice(): string {
        let discountPrice = '';

        this.GET_ITEM_DETAIL.offers.forEach((element) => {
            if (element.offer.status.id === STATUS.ACTIVE) {
                discountPrice = element.discountPrice;
            }
        });

        return discountPrice;
    }

    hasOffer(): boolean {
        if (this.GET_ITEM_DETAIL.offers) {
            return this.GET_ITEM_DETAIL.offers.some((element) => element.offer.status.id === STATUS.ACTIVE);
        }
        return false;
    }

    @products.Getter(ProductsTypes.getters.GET_ITEM_DETAIL)
    GET_ITEM_DETAIL!: Product;
}
</script>

<style scoped>
.item-offer__title {
    text-decoration: line-through;
}
</style>
