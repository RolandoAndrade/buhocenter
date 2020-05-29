<template>
    <v-card
            class="mx-auto"
            max-width="344"
            outlined
    >
        <v-list-item three-line>
            <v-list-item-content>
                <div class="overline mb-4">{{ getProvider() }}</div>
                <v-list-item-title class="headline mb-1 subtitle-1" >{{item.product.name}}</v-list-item-title>
                <v-list-item-subtitle>{{item.product.description}}</v-list-item-subtitle>
                <v-list-item-title class="headline mb-1 subtitle-1" >

                    <span :class="{ 'title': true, 'item-offer__title': hasOffer() }">${{ item.product.price }}</span>
                    <span v-if="hasOffer()" class="title"> ${{ getDiscountPrice() }} </span>
                </v-list-item-title>
            </v-list-item-content>

            <v-list-item-avatar
                    tile
                    size="80"
                    color="grey"
            >
                <v-img class="justify-center"
                       style="background: #ffffff"
                     :height="$vuetify.breakpoint.mdAndUp ? '115' : '50'"
                     :width="$vuetify.breakpoint.mdAndUp ? '115' : '50'"
                     :src="item.product.photos[0].imageUrl"
                     contain
                     alt="Product Image"
                ></v-img>
            </v-list-item-avatar>
        </v-list-item>

        <v-card-actions class="container ">
            <v-row class="d-flex justify-center">
                <v-col lg="1">
                    <v-checkbox
                            v-model="checkbox"
                            @change="changeSelectCheckout()"
                    ></v-checkbox>
                </v-col>
                <v-col lg="4" offset="1" class="mt-2">
                    <v-select
                            :value="item.quantity"
                            v-model="item.quantity"
                            :items="quantityValues"
                            @change="changeQuantity()"
                            :x-small="$vuetify.breakpoint.mdAndDown"
                            label="Qty"
                            height="30"
                            primary
                            dense
                            outlined
                    ></v-select>
                </v-col>
                <v-col lg="4" class="mt-4">
                    <v-btn color="primary" outlined class="btn-remove" @click="removeProductCart()">
                        {{$t('REMOVE')}}
                    </v-btn>
                </v-col>
            </v-row>

        </v-card-actions>
    </v-card>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    import {carts} from "@/store/namespaces";
    import CartMethods from "@/store/carts/methods/cart-methods";

    const ProductsCartProps = Vue.extend({
        props: {
            item: Object,
            index: Number,
        }
    })
    @Component
    export default class ProductCart extends ProductsCartProps {
        checkbox: boolean = false;
        quantityValues: string[] = [
            '1', '2', '3', '4', '5', '6', '10', '11', '12', '13', '14', '15', '16', '17',
            '18', '19', '20', '21', '22', '23', '25', '26', '27', '28', '29', '30',
        ];

        getProvider(): string {
            return this.item.product.productProvider[0].provider.name
        }

        hasOffer() {
            return !!this.item.product.offer;
        }

        mounted(){
            const index  = this.GET_PRODUCTS_CHECKOUT.findIndex((productCart)=>productCart.id == this.item.id);
            this.checkbox = index !== -1;
        }

        changeQuantity(){
            // console.log(this.item.quantity)
            const index_checkout  = this.GET_PRODUCTS_CHECKOUT.findIndex((productCart)=>productCart.id == this.item.id)
            const index  = this.GET_CART_OBJECT.productCarts.findIndex((productCart)=>productCart.id == this.item.id)
            this.SET_QUANTITY_PRODUCT({
                quantity:this.item.quantity,
                inCheckout:(index_checkout === -1)?false:true,
                index_checkout,
                index
            })
        }

        changeSelectCheckout(){
            const index  = this.GET_PRODUCTS_CHECKOUT.findIndex((productCart)=>productCart.id == this.item.id);
            if(index === -1){
                this.ADD_PRODUCT_CHECKOUT(this.item);
            }else{
                this.REMOVE_PRODUCT_CHECKOUT(index);
            }
        }

        getDiscountPrice(): string {
            return this.item.product.offer.discountPrice;
        }

        async removeProductCart(){
            const index  = this.GET_CART_OBJECT.productCarts.findIndex((productCart)=>productCart.id == this.item.id);
            await this.DELETE_PRODUCT_CART({productCartId: this.item.id,index});
        }

        @carts.Mutation(CartMethods.mutations.ADD_PRODUCT_CHECKOUT) ADD_PRODUCT_CHECKOUT;
        @carts.Mutation(CartMethods.mutations.REMOVE_PRODUCT_CHECKOUT) REMOVE_PRODUCT_CHECKOUT;
        @carts.Mutation(CartMethods.mutations.SET_QUANTITY_PRODUCT) SET_QUANTITY_PRODUCT;
        @carts.Getter(CartMethods.getters.GET_PRODUCTS_CHECKOUT) GET_PRODUCTS_CHECKOUT;
        @carts.Getter(CartMethods.getters.GET_CART_OBJECT) GET_CART_OBJECT;
        @carts.Action(CartMethods.actions.DELETE_PRODUCT_CART) DELETE_PRODUCT_CART;

    }
</script>

<style >
    .item-offer__title {
        text-decoration: line-through;
    }
</style>