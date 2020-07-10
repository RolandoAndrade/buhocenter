<template>
    <div>
        <v-row>
            <v-col
                cols="12"
                class="d-flex justify-center align-center"
                v-if="!GET_PRODUCTS_AND_PHOTOS_LOADED"
            >
                <v-progress-circular
                    class="justify-center mt-12"
                    :size="70"
                    :width="7"
                    color="primary"
                    indeterminate
                >
                </v-progress-circular>
            </v-col>
            <v-col
                cols="12"
                class="d-flex justify-center align-center"
                v-if="!GET_PRODUCTS_AND_PHOTOS_LOADED"
            >
                <p class="primary--text">{{ $t('LOADING_PRODUCTS') }}</p>
            </v-col>
            <v-col
                cols="12"
                lg="4"
                md="6"
                sm="6"
                v-for="item in GET_PRODUCTS"
                :key="item.id"
                class="mb-4 contenedor-product"
                style="max-height: 500px; position: relative;"
            >
                <v-card
                    class="d-inline-block"
                    height="450"
                    width="300"
                    @click="getItemDetail(item)"
                    v-if="GET_PRODUCTS_AND_PHOTOS_LOADED"
                >
                    <v-container style="height: 100%;">
                        <v-row justify="center">
                            <v-col cols="12">
                                <v-img height="200" contain :src="item.imageUrl"></v-img>
                            </v-col>
                            <v-col cols="9" class="pl-0 pb-0">
                                <v-row class="flex-column ma-0 fill-height caption" justify="center">
                                    <p>
                                        {{ $t('BY') }} <b>{{ getProvider(item) }}</b>
                                    </p>
                                </v-row>
                            </v-col>

                            <v-col cols="9" class="pl-0 product-name">
                                <v-row class="flex-column ma-0 fill-height caption" justify="center">
                                    {{ getName(item.name) }}
                                </v-row>
                            </v-col>

                            <v-col cols="9" class="pl-0 pb-0">
                                <div
                                    class="ma-0 mb-4"
                                    style="
                                        display: flex;
                                        align-items: center;
                                        justify-content: space-between;
                                        position: absolute;
                                        bottom: 0;
                                    "
                                >
                                    <div class="mr-4 mb-8" style="bottom: 0; font-size: 20px;">
                                        {{ item.price | getCurrentExchangeWithSymbolFor }}
                                    </div>
                                    <div
                                        v-if="item.tentativePoints"
                                        style="display: flex; align-items: center; font-size: 15px;"
                                    >
                                        <img src="@/assets/petromiles-small.png" class="mr-2 mb-8" />
                                        <div style="font-size: 15px;" class="mb-8">
                                            {{ item.tentativePoints }} pts
                                        </div>
                                    </div>
                                </div>
                            </v-col>

                            <v-col cols="9" class="pl-0">
                                <v-row class="flex-column ma-0 fill-height title ml-0 mr-0" justify="center">
                                    <v-rating
                                        :value="parseInt(item.rating)"
                                        background-color="orange lighten-3"
                                        color="primary"
                                        :small="$vuetify.breakpoint.mdAndUp"
                                        :x-small="$vuetify.breakpoint.mdAndDown"
                                        readonly
                                        :size="$vuetify.breakpoint.mdAndDown ? '3' : '30'"
                                        :dense="$vuetify.breakpoint.mdAndDown"
                                        style="position: absolute; bottom: 0;"
                                        class="mb-3"
                                    ></v-rating>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { products } from '../../../../store/namespaces';
import ProductsTypes from '@/store/products/methods/products.methods';
import { ITEM_TYPE } from '../../../../config/constants';
import { Product } from '@/modules/client/products/interfaces/products.interface';
import { getShortName } from '@/utils/global-functions';

@Component
export default class ProductCard extends Vue {
    contentLoaded = false;

    getItemDetail(item): void {
        if (item.type === ITEM_TYPE.PRODUCT) {
            this.$router.push({
                name: 'item-detail',
                query: { item: 'product', id: item.id },
            });
        } else {
            this.$router.push({
                name: 'item-detail',
                query: { item: 'service', id: item.id },
            });
        }
    }

    getName(name: string): string | undefined {
        return getShortName(name, 70);
    }

    getProvider(item): string {
        if (item.type === ITEM_TYPE.PRODUCT) {
            return item.provider.name;
        }
        return item.serviceProvider ? item.serviceProvider[0].provider.name : '';
    }

    @products.Action(ProductsTypes.actions.FETCH_SERVICE_DETAIL)
    FETCH_SERVICE_DETAIL;
    @products.Action(ProductsTypes.actions.FETCH_PRODUCT_DETAIL)
    FETCH_PRODUCT_DETAIL!: (productId: number) => boolean;
    @products.Getter(ProductsTypes.getters.GET_PRODUCTS) GET_PRODUCTS!: Product[];
    @products.Getter(ProductsTypes.getters.GET_PRODUCTS_AND_PHOTOS_LOADED)
    GET_PRODUCTS_AND_PHOTOS_LOADED!: boolean;
}
</script>
<style scoped lang="scss">
.pointer {
    cursor: pointer;
}
.fade-move {
    transition: transform 1s;
}
.card {
    transition: 500ms;
    position: relative;
    overflow: hidden;
}
.card img {
    z-index: 1;
}
.card button {
    width: 140px;
    margin-bottom: 10px;
}
.card:hover img {
    filter: blur(4px);
}
.card:hover .overlay {
    opacity: 0.8;
}
.card .overlay {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 70%;
    background-color: #232b34;
    opacity: 0;
    z-index: 100;
    transition: all 0.3s ease-in;
}
.card:hover,
.card:active {
    transform: scaleY(1.1) scaleX(1.06);
    box-shadow: 0 14px 98px rgba(0, 0, 0, 0.25), 0 0px 60px rgba(0, 0, 0, 0.22);
}
.product-name {
    cursor: pointer;
}

.product-name:hover {
    text-decoration: underline;
    color: #907f46;
}

.in-line {
    display: flex;
    align-items: center;
}

.space {
    justify-content: space-between;
}
</style>
