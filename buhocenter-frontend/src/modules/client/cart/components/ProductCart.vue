<template>
    <v-card class="mx-auto" max-width="344" outlined>
        <v-list-item three-line>
            <v-list-item-content class="d-flex justify-center">
                <v-col>
                    <v-row>
                        <div class="overline mb-4">{{ getProvider() }}</div>
                        <v-list-item-title class="headline mb-1 subtitle-1">{{
                            item.product.name
                        }}</v-list-item-title>
                        <v-list-item-icon
                            ><v-img :src="item.product.imageUrl" contain width="100"></v-img
                        ></v-list-item-icon>
                        <v-list-item-subtitle>{{ item.product.description }}</v-list-item-subtitle>
                        <v-list-item-title class="headline mb-1 subtitle-1">
                            <span :class="{ title: true, 'item-offer__title': hasOffer() }"
                                >${{ item.product.price }}</span
                            >
                            <span v-if="hasOffer()" class="title"> ${{ getDiscountPrice() }} </span>
                        </v-list-item-title>
                    </v-row>
                </v-col>
            </v-list-item-content>

            <v-list-item-avatar tile size="80" color="grey">
                <v-img
                    class="justify-center"
                    style="background: #ffffff;"
                    :height="$vuetify.breakpoint.mdAndUp ? '115' : '50'"
                    :width="$vuetify.breakpoint.mdAndUp ? '115' : '50'"
                    :src="item.product.productPhotos[0].imageUrl"
                    contain
                    alt="Product Image"
                ></v-img>
            </v-list-item-avatar>
        </v-list-item>

        <v-card-actions class="container">
            <v-row class="d-flex justify-center">
                <v-col lg="1">
                    <v-checkbox v-model="checkbox" @change="changeSelectCheckout()"></v-checkbox>
                </v-col>
                <v-col lg="4" offset="1" class="mt-2">
                    <v-select
                        :value="item.quantity.toString()"
                        v-model="quantity"
                        :items="getProductStock"
                        @change="changeQuantity()"
                        :x-small="$vuetify.breakpoint.mdAndDown"
                        :label="this.quantity"
                        height="30"
                        primary
                        dense
                        outlined
                    ></v-select>
                </v-col>
                <v-col lg="4" class="mt-4">
                    <v-btn color="primary" outlined class="btn-remove" @click="removeProductCart()">
                        {{ $t('REMOVE') }}
                    </v-btn>
                </v-col>
            </v-row>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { carts } from '@/store/namespaces';
import CartMethods from '@/store/carts/methods/cart.methods';
import { ProductCarts, CartInterface } from '../interfaces/carts.interface';

@Component
export default class ProductCart extends Vue {
    @Prop() item!: ProductCarts;
    @Prop() index!: number;

    checkbox = false;

    stock: string[] = ['1', '2', '3'];
    quantity: number = this.item.quantity!;

    get getProductStock(): string[] {
        var productStock: string[] = [];
        for (var i = 0; i < this.item.product!.productInventory!.availableQuantity; i++) {
            productStock.push((i + 1).toString());
        }
        return productStock;
    }

    getProvider(): string {
        return this.item.product!.provider!.name;
    }

    hasOffer() {
        return !!this.item!.product!.offer;
    }

    mounted() {
        //this.stock= this.getProductStock();
        const index = this.GET_PRODUCTS_CHECKOUT.findIndex((productCart) => productCart.id == this.item.id);
        this.checkbox = index !== -1;
        console.log(this.item);
    }

    changeQuantity() {
        const index_checkout = this.GET_PRODUCTS_CHECKOUT.findIndex(
            (productCart) => productCart.product!.id == this.item.product!.id,
        );
        const index = this.GET_CART_OBJECT.findIndex((productCart) => productCart.id == this.item.id);
        this.SET_QUANTITY_PRODUCT({
            quantity: this.quantity,
            inCheckout: index_checkout === -1 ? false : true,
            index_checkout,
            index,
        });
    }

    changeSelectCheckout() {
        const index = this.checkoutIndex;
        if (index === -1) {
            const checkout: ProductCarts = {
                quantity: this.item.quantity!,
                product: this.item.product!,
                id: this.item.id,
            };
            this.ADD_PRODUCT_CHECKOUT(checkout);
        } else {
            this.REMOVE_PRODUCT_CHECKOUT(index);
        }
    }

    get checkoutIndex() {
        return this.GET_PRODUCTS_CHECKOUT.findIndex(
            (productCart) => productCart!.product!.id == this.item.product!.id,
        );
    }

    getDiscountPrice(): string {
        return this.item.product!.offer.discountPrice;
    }

    async removeProductCart() {
        this.REMOVE_PRODUCT_CHECKOUT(this.checkoutIndex);
        const index = this.GET_CART_OBJECT.findIndex((productCart) => productCart.id == this.item.id);
        await this.DELETE_PRODUCT_CART({ productCartId: this.item.id!, index });
    }

    @carts.Mutation(CartMethods.mutations.ADD_PRODUCT_CHECKOUT)
    ADD_PRODUCT_CHECKOUT;
    @carts.Mutation(CartMethods.mutations.REMOVE_PRODUCT_CHECKOUT)
    REMOVE_PRODUCT_CHECKOUT;
    @carts.Mutation(CartMethods.mutations.SET_QUANTITY_PRODUCT)
    SET_QUANTITY_PRODUCT;
    @carts.Getter(CartMethods.getters.GET_PRODUCTS_CHECKOUT)
    GET_PRODUCTS_CHECKOUT!: ProductCarts[];
    @carts.Getter(CartMethods.getters.GET_CART_OBJECT)
    GET_CART_OBJECT!: ProductCarts[];
    @carts.Action(CartMethods.actions.DELETE_PRODUCT_CART)
    DELETE_PRODUCT_CART!: (data: { productCartId: number; index: number }) => boolean;
}
</script>

<style>
.item-offer__title {
    text-decoration: line-through;
}
</style>
