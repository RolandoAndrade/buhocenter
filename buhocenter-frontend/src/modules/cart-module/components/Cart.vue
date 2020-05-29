<template>
        <v-container>
                <v-list-item v-if="GET_LOAD_PHOTO_CART" v-for="(item,i) in GET_CART_OBJECT.productCarts" :key="item.id" class="mb-4">
                        <ProductCart :item="item" :index="i"></ProductCart>
                </v-list-item>
                <v-list-item>
                        <v-card
                                margin="0px"
                        >
                                <v-card-actions>
                                        Subtotal({{GET_PRODUCTS_CHECKOUT.length}} items):{{" "}}<b>{{GET_TOTAL_PRICE_CHECKOUT.toFixed(2)}}$</b>
                                </v-card-actions>
                                <v-card-actions>
                                        <v-btn @click="checkout"  color="primary" outlined class="btn-remove" >{{$t('PROCEED_CHECKOUT')}}</v-btn>
                                </v-card-actions>
                        </v-card>
                </v-list-item>
        </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { authModule, carts, payments, loader } from "@/store/namespaces";
import ProductCart from "@/modules/cart-module/components/ProductCart.vue";
import AuthMethods from "@/store/auth-module/methods/auth-methods";
import CartMethods from "@/store/carts/methods/cart-methods";
import { ITEM_TYPE, CURRENCY } from '../../../config/constants';
import { SHOW_LOADER } from '../../../store/loader/methods/loader.actions';
import {
    CREATE_ORDER,
} from '../../../store/payments/methods/payments.actions';

@Component({
    components: {ProductCart},
})
export default class Cart extends Vue {

    async mounted(){
        if(this.GET_AUTH_TOKEN !== ''){
            this.FALSE_PHOTO_CART();
            await this.GET_ITEMS_CARS(this.GET_CLIENT_DATA.id);
            if( this.GET_CART_OBJECT.productCarts ){
                    await this.FETCH_PRODUCT_CART_PHOTO_BY_NAME(this.GET_CART_OBJECT.productCarts);
            }
        }

    }

    getProductPrice(item) {
        if (item.product.offer) {
            return `${parseFloat(item.product.offer.discountPrice) * parseInt(item.quantity)}`;
        }

        return `${parseFloat(item.product.price) * parseInt(item.quantity)}`;
    }

    createOrder() {
        // FIX: Acomodar al implementar el dropdown multimoneda
        const currencyISO: string = 'USD';
        const currencyId: number = CURRENCY.USD.id;

        const items: any = [];
        let total: number = 0;

        let order: any = {
            customer: {
                id: this.GET_CLIENT_DATA.id,
                firstName: this.GET_CLIENT_DATA.name,
                lastName: this.GET_CLIENT_DATA.lastName,
                email: this.GET_CLIENT_DATA.email,
                country: 'US',
            },
            currency: {
                id: currencyId,
                name: currencyISO,
            }
        };
        
        this.GET_PRODUCTS_CHECKOUT.forEach(i => {
            total += parseFloat(this.getProductPrice(i));

            const item = {
                sku: `${i.product.id}`,
                name: i.product.name,
                price: `${this.getProductPrice(i)}`,
                currency: currencyISO,
                quantity: parseInt(`${i.quantity}`),
                type: {
                    id: ITEM_TYPE.PRODUCT
                },
            }
            
            items.push(item);
        });

        order.items = items;

        order.amount = {
            total: `${total}`,
            currency: currencyISO,
            details: {
                subtotal: `${total}`,
            }
        }

        order.cart = {
            id: this.GET_CART_OBJECT.id,
        }

        return order;
    }

    async checkout() {
        const order = this.createOrder();
            
        this.SHOW_LOADER(true);

        const paymentUrl: string | boolean = await this.CREATE_ORDER(order);

        if (paymentUrl) {
            this.SHOW_LOADER(false);
            window.open(paymentUrl as string, '_blank');
        }

        this.GET_ITEMS_CARS(this.GET_CLIENT_DATA.id);

        this.SHOW_LOADER(false);
    }

    @loader.Action(SHOW_LOADER) SHOW_LOADER;

    @authModule.Getter(AuthMethods.getters.GET_AUTH_TOKEN) GET_AUTH_TOKEN;
    @authModule.Getter(AuthMethods.getters.GET_CLIENT_DATA) GET_CLIENT_DATA;

    @carts.Action(CartMethods.actions.GET_ITEMS_CARS) GET_ITEMS_CARS;
    @carts.Action(CartMethods.actions.FETCH_PRODUCT_CART_PHOTO_BY_NAME) FETCH_PRODUCT_CART_PHOTO_BY_NAME;
    @carts.Getter(CartMethods.getters.GET_CART_OBJECT) GET_CART_OBJECT;
    @carts.Getter(CartMethods.getters.GET_PRODUCTS_CHECKOUT) GET_PRODUCTS_CHECKOUT;
    @carts.Getter(CartMethods.getters.GET_TOTAL_PRICE_CHECKOUT) GET_TOTAL_PRICE_CHECKOUT;
    @carts.Getter(CartMethods.getters.GET_LOAD_PHOTO_CART) GET_LOAD_PHOTO_CART;
    @carts.Mutation(CartMethods.mutations.FALSE_PHOTO_CART) FALSE_PHOTO_CART;

    @payments.Action(CREATE_ORDER) private CREATE_ORDER;
}
</script>

<style>
.btn-remove{
    height: 30px !important;
}
</style>

