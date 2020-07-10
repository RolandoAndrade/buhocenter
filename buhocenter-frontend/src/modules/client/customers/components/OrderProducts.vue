<template>
    <v-row>
        <v-col>
            <v-card
                class="d-flex flex-wrap mb-2"
                outlined
                v-for="product in GET_PRODUCTS_ORDER.carts"
                :key="product.id"
            >
                <v-col :cols="responsiveDetail()" class="d-flex justify-center">
                    <v-list-item-avatar tile size="120">
                        <v-img
                            v-if="product.product.productPhotos[0].content.startsWith('http')"
                            contain
                            :src="product.product.productPhotos[0].content"
                        ></v-img>
                    </v-list-item-avatar>
                </v-col>
                <v-col>
                    <v-list-item-title class="font-weight-bold mb-1">{{
                        getName(product.product.name)
                    }}</v-list-item-title>
                    <div class="overline mb-4">{{ product.product.provider.name }}</div>
                    <v-list-item-subtitle class="mb-7">{{
                        product.productPrice | getCurrentExchangeWithSymbolFor
                    }}</v-list-item-subtitle>
                    <v-list-item-subtitle>{{ $t('QUANTITY') }}: {{ product.quantity }}</v-list-item-subtitle>
                </v-col>
                <v-col class="d-flex justify-end align-center">
                    <RateProduct :product="product.product" :alreadyRated="alreadyRated" @newRate="newRate" />
                </v-col>
            </v-card>
        </v-col>
    </v-row>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import { Prop, Vue } from 'vue-property-decorator';
import { payments } from '@/store/namespaces';
import { ProductsOrder } from '@/modules/client/customers/interfaces/orders.interface';
import PaymentsTypes from '@/store/payments/methods/payments.methods';
import RateProduct from './RateProduct.vue';
import { getShortName } from '@/utils/global-functions';

@Component({
    components: { RateProduct },
})
export default class OrderHistoryProduct extends Vue {
    @Prop() order!: number;
    @Prop() showImg!: boolean;

    loading = false;
    loadRate = true;
    alreadyRated = false;
    showImages = false;

    responsiveDetail(): number {
        const { xs, sm } = this.$vuetify.breakpoint;
        return xs || sm ? 12 : 3;
    }

    getName(name: string): string {
        return getShortName(name, 50);
    }

    newRate(status: boolean): void {
        this.loadRate = true;

        this.alreadyRated = status;
    }

    @payments.Getter(PaymentsTypes.getters.GET_PRODUCTS_ORDER)
    private GET_PRODUCTS_ORDER!: ProductsOrder[];
}
</script>

<style lang="scss"></style>
