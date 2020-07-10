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
                <v-col cols="auto" class="justify-center d-flex">
                    <img width="200" src="../../../../assets/shipThisLogo.png" />
                </v-col>

                <br />
                <h5 style="width: 100%; text-align: center;">
                    {{ $t('SELECT_PACKAGE_INSURANCE') }}
                </h5>
            </v-row>
            <v-container>
                <v-data-table
                    :headers="headers"
                    :items="GET_PRODUCTS_CHECKOUT"
                    hide-default-footer
                    class="elevation-1"
                >
                    <template v-slot:item.name="{ item }">
                        {{ item.product.name }}
                    </template>
                    <template v-slot:item.photo="{ item }">
                        <v-img height="100" width="100" :src="item.product.imageUrl" contain></v-img>
                    </template>
                    <template v-slot:item.width="{ item }">
                        {{ item.product.productDimension.width + ' cm' }}
                    </template>
                    <template v-slot:item.height="{ item }">
                        {{ item.product.productDimension.height + ' cm' }}
                    </template>
                    <template v-slot:item.long="{ item }">
                        {{ item.product.productDimension.long + ' cm' }}
                    </template>
                    <template v-slot:item.weight="{ item }">
                        {{ item.product.productDimension.weight + ' cm' }}
                    </template>
                    <template v-slot:item.quantity="{ item }" style="text-align: center;">
                        <b style="text-align: center;">{{ item.quantity }}</b>
                    </template>
                    <template v-slot:item.price="{ item }">
                        <b>{{ item.product.price | getCurrentExchangeWithSymbolFor }}</b>
                    </template>
                    <template v-slot:item.priceInsurance="{ item }">
                        <b>{{ item.product.priceInsurance | getCurrentExchangeWithSymbolFor }}</b>
                    </template>
                    <template v-slot:item.hasAnInsurance="{ item }">
                        <v-switch v-model="item.hasInsurance" @change="setInsurance(item.id)"></v-switch>
                    </template>
                    <template v-slot:body.append>
                        <tr>
                            <td colspan="7"></td>
                            <td>
                                <b>{{ GET_TOTAL_PRICE_CHECKOUT }}$</b>
                            </td>
                            <td colspan="2">
                                <b>{{
                                    getTotalInsurancePrice().toFixed(2) | getCurrentExchangeWithSymbolFor
                                }}</b>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="5"></td>
                            <td>
                                <v-tooltip top>
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn icon v-bind="attrs" v-on="on">
                                            <v-icon color="black lighten-1">mdi-alert-circle</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Total(products price + insurances price)</span>
                                </v-tooltip>
                            </td>
                            <td style="text-align: center;">
                                <b>Total</b>
                            </td>
                            <td colspan="3">
                                <b>{{ getTotalPrice().toFixed(2) | getCurrentExchangeWithSymbolFor }}</b>
                            </td>
                        </tr>
                    </template>
                </v-data-table>
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

@Component
export default class PackageInsuranceStep extends Vue {
    public timeout?: number = 2000;
    public total?: number = 0;
    headers = [
        {
            text: 'Name',
            align: 'start',
            value: 'name',
            width: '35%',
        },
        { text: 'Photo', value: 'photo' },
        { text: 'Width', value: 'width' },
        { text: 'Height', value: 'height' },
        { text: 'Long', value: 'long' },
        { text: 'Weight', value: 'weight' },
        { text: 'Quantity', value: 'quantity' },
        { text: 'Product price', value: 'price' },
        { text: 'Insurance price', value: 'priceInsurance' },
        { text: 'Insurance', value: 'hasAnInsurance' },
    ];

    getTotalInsurancePrice(): number {
        let price = 0;
        const checkout = this.GET_PRODUCTS_CHECKOUT;
        checkout.map(({ product, quantity }) => {
            //@ts-ignore
            price = price + parseFloat(product.priceInsurance) * parseInt(quantity);
        });

        return price;
    }

    setInsurance(id: number): void {
        let checkout = this.GET_PRODUCTS_CHECKOUT;
        const index = checkout.findIndex((product) => product.id === id);
        //@ts-ignore
        checkout[index].product.hasInsurance = !checkout[index].product.hasInsurance;
        this.SET_TENTATIVE_POINTS_PRODUCTS_CHECKOUT(checkout);
    }

    getTotalPrice(): number {
        const sub = this.GET_TOTAL_PRICE_CHECKOUT;
        let price = 0;
        const checkout = this.GET_PRODUCTS_CHECKOUT;
        checkout.map(({ product, quantity }) => {
            //@ts-ignore
            if (product.hasInsurance) {
                //@ts-ignore
                price = price + parseFloat(product.priceInsurance) * parseInt(quantity);
            }
        });
        const total = sub + price;
        return total;
    }

    mounted() {
        this.total = this.GET_TOTAL_PRICE_CHECKOUT;
    }

    @carts.Getter(CartTypes.getters.GET_PRODUCTS_CHECKOUT)
    private GET_PRODUCTS_CHECKOUT!: ProductCarts[];

    @carts.Getter(CartMethods.getters.GET_TOTAL_PRICE_CHECKOUT)
    GET_TOTAL_PRICE_CHECKOUT!: number;

    @carts.Mutation(CartTypes.mutations.SET_TENTATIVE_POINTS_PRODUCTS_CHECKOUT)
    private SET_TENTATIVE_POINTS_PRODUCTS_CHECKOUT;
}
</script>
