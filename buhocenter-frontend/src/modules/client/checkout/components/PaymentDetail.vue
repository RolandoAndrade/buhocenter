<template>
    <div>
        <v-container class="mb-4">
            <v-row justify="center">
                <v-col cols="12" class="justify-center d-flex">
                    <div>
                        <h2 class="mb-1 mt-0">{{ $t('PAYMENT_DETAIL') }}</h2>
                        <div class="line"></div>
                    </div>
                </v-col>
                <v-col cols="auto" class="justify-center d-flex" v-if="showPM">
                    <img width="100" src="../../../../assets/petromiles.png" />
                </v-col>

                <br />
            </v-row>
            <v-container>
                <h5 class="text-center">{{ $t('PRODUCTS') }}</h5>
                <v-row
                    justify="center"
                    v-for="(product, index) in GET_PRODUCTS_CHECKOUT"
                    :key="'producto-' + index"
                    style="height: 300px;"
                >
                    <v-col cols="8" style="cursor: pointer;" :key="product.product.id">
                        <v-card class="d-inline-block mx-auto" style="width: 100%;">
                            <v-container>
                                <v-row justify="space-between">
                                    <v-col cols="auto">
                                        <v-img
                                            height="200"
                                            width="200"
                                            contain
                                            :src="product.product.imageUrl"
                                        ></v-img>
                                    </v-col>
                                    <v-col cols="7" class="pl-0">
                                        <v-row class="d-flex ma-0 fill-height" align="center">
                                            <h5 style="width: 100%;">{{ product.product.name }}</h5>
                                            <div class="col-4">
                                                <p>
                                                    <b>{{ $t('PRICE') }}:</b>
                                                    {{
                                                        getProductPrice(product)
                                                            | getCurrentExchangeWithSymbolFor
                                                    }}
                                                </p>
                                            </div>
                                            <div class="col-4">
                                                <p>
                                                    <b>{{ $t('QUANTITY') }}:</b> {{ product.quantity }}
                                                </p>
                                            </div>
                                            <div class="col-4" v-if="product.product.tentativePoints">
                                                <p align="center">
                                                    <img
                                                        src="../../../../assets/petromiles.png"
                                                        width="20"
                                                        style="
                                                            top: 5px;
                                                            position: relative;
                                                            margin-right: 5px;
                                                        "
                                                    />
                                                    <b>{{ product.product.tentativePoints }} pts</b>
                                                </p>
                                            </div>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-container>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { carts } from '@/store/namespaces';
import CartTypes from '@/store/carts/methods/cart.methods';
import { ProductCarts } from '@/modules/client/cart/interfaces/carts.interface';
import CartMethods from '@/store/carts/methods/cart.methods';
import view from 'vue-router/src/components/view';

@Component
export default class PaymentDetail extends Vue {
    public timeout?: number = 2000;
    public showPM: boolean = false;

    getProductPrice(product_cart): number {
        const { product } = product_cart;
        const { quantity } = product_cart;
        if (product!.offer && product!.offer.discountPrice) {
            return parseFloat(product!.offer.discountPrice) * quantity!;
        }
        return product!.price! * quantity!;
    }

    mounted(): void {
        this.GET_PRODUCTS_CHECKOUT.map((product_cart) => {
            if (product_cart.product?.tentativePoints) {
                this.showPM = true;
            }
        });
    }

    @carts.Getter(CartTypes.getters.GET_PRODUCTS_CHECKOUT)
    private GET_PRODUCTS_CHECKOUT!: ProductCarts[];

    @carts.Getter(CartMethods.getters.GET_TOTAL_PRICE_CHECKOUT)
    GET_TOTAL_PRICE_CHECKOUT!: number;
}
</script>
