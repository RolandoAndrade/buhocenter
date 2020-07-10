<template>
    <v-card class="mb-5 mx-12 pa-3" elevation="5">
        <v-row class="align-center">
            <v-col class="d-flex align-center">
                <p class="ma-0">{{ $t('ORDER_TITLE') }} {{ order.transaction }}</p>
                <v-chip color="primary" class="mx-3">{{
                    order.statusHistories[order.statusHistories.length - 1].status.name
                }}</v-chip>
                <v-divider vertical class="mx-3"></v-divider>
                <div class="d-flex justify-center align-center mx-3">
                    <div class="ma-0">
                        <v-img src="../../../../assets/logoRoute.png" height="50" width="50" contain></v-img>
                    </div>
                    <a :href="order.trackingUrl" class="ma-0 mx-3">Track package in ShipThis</a>
                </div>
            </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row>
            <v-col class="d-flex">
                <p class="my-0 mx-1 title primary--text">{{ $t('ORDER_DETAIL') }}</p>
            </v-col>
        </v-row>
        <v-row class="d-flex align-center">
            <v-col>
                <p class="my-0 mx-1">
                    <b>{{ $t('ORDER_CREATE') }}</b> {{ setDate(order.createdAt) }}
                </p>
                <p class="my-0 mx-1">
                    <b>{{ $t('ORDER_NAME') }}</b> {{ order.address.user.name }}
                    {{ order.address.user.lastName }}
                </p>
                <p class="my-0 mx-1">
                    <b>{{ $t('ORDER_EMAIL') }}</b> {{ order.address.user.email }}
                </p>
                <p class="my-0 mx-1">
                    <b>{{ $t('ORDER_ADDRESS') }}</b> {{ order.address.firstStreet }}
                    {{ order.address.secondStreet }} {{ order.address.city }} {{ order.address.state }}
                    {{ order.address.zipcode }}
                </p>
            </v-col>
            <v-col cols="5">
                <p class="my-0 mx-1">
                    <b>{{ $t('ORDER_TOTAL') }}</b> ${{ order.total }}
                </p>
                <p class="my-0 mx-1">
                    <b>{{ $t('ORDER_TOTAL_CC') }}</b> {{ order.totalCryptocurrency }}
                    {{ order.cryptocurrency.iso }}
                </p>
                <p class="my-0 mx-1">
                    <b>{{ $t('ORDER_SERVICE_FEE') }}</b> ${{ order.commission.serviceFee }}
                </p>
                <p class="my-0 mx-1">
                    <b>{{ $t('ORDER_PROCESSOR_FEE') }}</b> ${{ order.commission.processorFee }}
                </p>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="d-flex">
                <p class="my-0 mx-1 title primary--text">
                    {{ $t('ORDER_PRODUCTS') }} ({{ order.carts.length }})
                </p>
            </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row>
            <v-col>
                <v-card class="my-1 pa-3" v-for="product in order.carts" :key="product.id" outlined>
                    <p class="ma-0">
                        <b>{{ $t('ORDER_PRODUCT') }}</b> {{ product.product.name }}
                    </p>
                    <p class="ma-0">
                        <b>{{ $t('ORDER_BRAND') }}</b> {{ product.product.brand.name }}
                    </p>
                    <p class="ma-0">
                        <b>{{ $t('ORDER_PROVIDER') }}</b> {{ product.product.provider.name }}
                    </p>
                    <p class="ma-0">
                        <b>{{ $t('ORDER_PRODUCT_PRICE') }}</b> ${{ product.productPrice }}
                    </p>
                    <p class="ma-0">
                        <b>{{ $t('ORDER_PRODUCT_QUANTITY') }}</b> {{ product.quantity }}
                    </p>
                </v-card>
            </v-col>
        </v-row>
    </v-card>
</template>
<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';
import { Order } from '@/modules/management/orders/interfaces/orders.interface';
import { formatDate } from '@/utils/date-functions';

@Component
export default class OrderComponent extends Vue {
    @Prop() order!: Order;

    setDate(date: string): string {
        return formatDate(date);
    }
}
</script>
<style></style>
