<template>
    <v-container class="ma-0">
        <v-container style="margin-top: 60px;">
            <v-form ref="form" class="d-flex justify-center">
                <v-select
                    v-if="!inCart"
                    v-model="quantity"
                    :rules="[rules.required()]"
                    :items="stock"
                    :x-small="$vuetify.breakpoint.mdAndDown"
                    :label="$t('QUANTITY')"
                    primary
                    dense
                    outlined
                ></v-select>
            </v-form>
        </v-container>
        <v-container v-if="isProduct()" class="overline d-flex justify-center">
            <v-btn
                @click="addToCart()"
                block
                outlined
                color="primary"
                :x-small="$vuetify.breakpoint.mdAndDown"
                v-if="!inCart"
            >
                <v-icon left class="d-flex align-center">mdi-cart-outline</v-icon>
                <p class="ma-0 d-none d-lg-block">{{ $t('ADD_TO_CART') }}</p>
            </v-btn>
            <v-btn
                @click="addToCart()"
                block
                outlined
                color="primary"
                :x-small="$vuetify.breakpoint.mdAndDown"
                v-if="inCart"
                disabled
            >
                <v-icon left class="d-flex align-center">mdi-cart-outline</v-icon>
                <p class="ma-0 d-none d-lg-block">{{ $t('PRODUCT_IN_CART') }}</p>
            </v-btn>
        </v-container>
        <v-divider></v-divider>
        <v-container class="overline mt-3 justify-center" v-if="this.defaultAddress[0]">
            <v-icon small color="black"> mdi-map-marker-outline </v-icon>
            {{ $t('DELIVER_TO') }}: {{ this.defaultAddress[0].city }}, {{ this.defaultAddress[0].state }}
        </v-container>
        <v-divider v-if="this.defaultAddress[0]"></v-divider>
        <SocialIcons />
    </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { Emit, Component, Prop, Watch } from 'vue-property-decorator';
import { authModule, addresses, carts, products } from '../../../../store/namespaces';
import AuthTypes from '../../../../store/auth/methods/auth.methods';
import SocialIcons from '@/modules/client/social/components/SocialIcons.vue';
import rules from '../../../../utils/rules';
import { CustomerInterface } from '@/modules/client/auth/interfaces/customer.interface';
import { Product } from '@/modules/client/products/interfaces/products.interface';
import { Address } from '@/modules/client/addresses/interfaces/address.interface';
import AddressTypes from '@/store/addresses/methods/address.methods';
import ProductsTypes from '@/store/products/methods/products.methods';
import CartMethods from '@/store/carts/methods/cart.methods';
import { ProductCarts } from '@/modules/client/cart/interfaces/carts.interface';

@Component({
    components: {
        SocialIcons,
    },
})
export default class ShoppingBar extends Vue {
    quantity = 0;
    defaultAddress: Address[] = [];
    inCart = false;

    @Prop({ default: '', required: false }) stock!: string[];

    rules: any = rules;

    $refs!: {
        form: any;
    };

    isProduct(): boolean {
        if (this.$route.query.item === 'product') {
            return true;
        }

        return false;
    }

    @Watch('GET_PRODUCTS_CART.length')
    @Watch('GET_CART_OBJECT.length')
    checkProductInCart(): void {
        this.inCart = false;
        this.GET_PRODUCTS_CART.forEach((product) => {
            if (this.GET_ITEM_DETAIL.id == product.product?.id) {
                this.inCart = true;
            }
        });
    }

    @Emit('addToCart')
    async addToCart() {
        if (!this.GET_CLIENT_DATA.id) {
            this.$router.push({ name: 'Sign in' });
        } else if (this.$refs.form.validate()) {
            if (!this.quantity) {
                return;
            }
            this.$emit('addItemToCart', this.quantity);
        }
    }

    getDefaultAddress(): void {
        const addresses = this.GET_ADDRESSES;
        addresses.forEach((address) => {
            if (address.setDefault == true) {
                this.defaultAddress.push(address);
            }
        });
    }

    async mounted() {
        await this.getDefaultAddress();
        await this.FETCH_PRODUCT_DETAIL(Number(this.$route.query.id));
        await this.checkProductInCart();
    }

    @authModule.Getter(AuthTypes.getters.GET_CLIENT_DATA)
    private GET_CLIENT_DATA!: CustomerInterface;

    @addresses.Getter(AddressTypes.getters.GET_ADDRESSES)
    private GET_ADDRESSES;

    @products.Getter(ProductsTypes.getters.GET_ITEM_DETAIL)
    GET_ITEM_DETAIL!: Product;

    @products.Action(ProductsTypes.actions.FETCH_PRODUCT_DETAIL)
    FETCH_PRODUCT_DETAIL!: (productId: number) => boolean;

    @carts.Getter(CartMethods.getters.GET_CART_OBJECT)
    GET_CART_OBJECT!: ProductCarts[];
    @carts.Getter(CartMethods.getters.GET_PRODUCTS_CART)
    GET_PRODUCTS_CART!: ProductCarts[];
}
</script>
<style scoped>
.social {
    text-decoration: none !important;
}
</style>
