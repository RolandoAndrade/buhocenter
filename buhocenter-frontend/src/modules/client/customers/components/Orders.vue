<template>
    <v-container fluid>
        <v-img src="../../../../assets/images/orders.jpg" height="125" class="grey darken-4"></v-img>
        <v-row class="d-flex align-center mt-6">
            <v-col cols="2">
                <v-btn icon @click="goToProfile()">
                    <v-icon large color="primary">
                        mdi-arrow-left
                    </v-icon>
                </v-btn>
            </v-col>
            <v-col>
                <div class="title-2">
                    {{ $t('MY_ORDERS') }}
                    <div class="line"></div>
                </div>
            </v-col>
            <v-col cols="2"></v-col>
        </v-row>
        <v-row class="d-flex justify-center">
            <v-col :cols="responsiveSelect()">
                <v-select
                    @change="setYear"
                    v-model="year"
                    dense
                    :items="years"
                    :label="$t('YEAR')"
                    solo
                ></v-select>
            </v-col>
        </v-row>
        <v-row class="d-flex justify-center">
            <v-col :cols="responsiveOrders()">
                <EmptyState class="mt-n12" v-if="this.selectOrder().length == 0" :message="emptyMessage" />
                <v-expansion-panels popout class="mt-n4">
                    <v-expansion-panel v-for="order in selectOrder()" :key="order.id">
                        <v-expansion-panel-header class="primary--text" @click="fetchProductsOrder(order.id)">
                            <v-row class="d-flex align-start justify-center my-n6">
                                <v-col :cols="responsiveDetail()" class="align-start">
                                    <p>{{ $t('ORDER').toUpperCase() }} #</p>
                                    <p class="black--text mt-n2">{{ order.id }}</p>
                                </v-col>
                                <v-col :cols="responsiveDate()">
                                    <p>{{ $t('ORDER_PLACED').toUpperCase() }}</p>
                                    <p class="black--text mt-n2">
                                        {{ order.createdAt.split('T')[0] }}
                                    </p>
                                </v-col>
                                <v-col :cols="responsiveDetail()">
                                    <p>TOTAL</p>
                                    <p class="black--text mt-n2">
                                        {{ order.total | getCurrentExchangeWithSymbolFor }}
                                    </p>
                                </v-col>
                                <v-col :cols="responsiveStatus()" class="">
                                    <v-chip outlined small class="mt-6">
                                        <v-avatar left>
                                            <v-icon small> {{ statusIcon }} </v-icon>
                                        </v-avatar>
                                        {{ $t(`${getLastStatus(order.statusHistories)}`).toUpperCase() }}
                                    </v-chip>
                                </v-col>
                            </v-row>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <div class="d-flex justify-end" v-if="order.cryptocurrency">
                                <h1 class="overline">{{ $t('CRYPTOCURRENCY_AMOUNT') }}:</h1>
                                <h1 class="overline font-weight-bold ml-6">
                                    {{ order.totalCryptocurrency }} {{ order.cryptocurrency.iso }} ({{
                                        order.cryptocurrency.name
                                    }})
                                </h1>
                            </div>
                            <div class="d-flex justify-end" v-else>
                                <h1 class="overline">{{ $t('PAYMENT_NOT_COMPLETED_CRYTO_NOT_SELECTED') }}</h1>
                            </div>
                            <div class="d-flex justify-space-between align-center">
                                <div class="d-flex justify-center align-center">
                                    <div>
                                        <v-img
                                            src="../../../../assets/logoRoute.png"
                                            height="50"
                                            width="50"
                                            contain
                                        ></v-img>
                                    </div>
                                    <a :href="order.trackingUrl" target="_blank" class="mx-3">Track package in ShipThis</a>
                                </div>
                                <v-btn
                                    small
                                    outlined
                                    color="primary"
                                    class="primary--text overline"
                                    @click="() => downloadInvoice(order.id)"
                                >
                                    <v-icon small class="mr-2"> mdi-download </v-icon>
                                    {{ $t('INVOICE') }}
                                </v-btn>
                            </div>
                            <Product :order="order.id" />
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </v-col>
        </v-row>
    </v-container>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { payments, authModule } from '@/store/namespaces';
import AuthTypes from '../../../../store/auth/methods/auth.methods';
import PaymentsTypes from '@/store/payments/methods/payments.methods';
import { CustomerInterface } from '@/modules/client/auth/interfaces/customer.interface';
import { Orders, StatusHistory } from '@/modules/client/customers/interfaces/orders.interface';
import Product from './OrderProducts.vue';
import EmptyState from '@/modules/common/components/EmptyState.vue';
import { TranslateResult } from 'vue-i18n';
import CustomersRepository from '@/modules/client/customers/repositories/customers.repository';

@Component({
    components: { Product, EmptyState },
})
export default class ClientOrders extends Vue {
    years = [this.translateWordAll(), '2020', '2019', '2018', '2017'];
    statusIcon = '';
    year = '';
    ordersFilter: Orders[] = [];
    emptyMessage = 'NO_ORDERS';

    translateWordAll(): TranslateResult {
        return this.$t('ALL');
    }

    responsiveDetail(): number {
        const { xs, sm } = this.$vuetify.breakpoint;
        return xs || sm ? 5 : 2;
    }

    responsiveDate(): number {
        const { xs, sm } = this.$vuetify.breakpoint;
        return xs || sm ? 7 : 6;
    }

    responsiveStatus(): number {
        const { xs, sm } = this.$vuetify.breakpoint;
        return xs || sm ? 7 : 2;
    }

    responsiveOrders(): number {
        const { xs, sm } = this.$vuetify.breakpoint;
        return xs || sm ? 12 : 10;
    }

    responsiveSelect(): number {
        const { xs, sm } = this.$vuetify.breakpoint;
        return xs || sm ? 6 : 2;
    }

    selectOrder(): Orders[] {
        if (this.year == '' || this.year == this.translateWordAll()) return this.GET_ORDERS;
        else return this.ordersFilter;
    }

    setYear(): void {
        let ordersArray: Orders[] = [];
        this.GET_ORDERS.forEach((el: Orders) => {
            if (this.year === el.createdAt.toString().split('-')[0]) {
                ordersArray.push(el);
            }
        });
        if (this.year == this.translateWordAll()) ordersArray = [];
        this.ordersFilter = ordersArray;
    }

    getLastStatus(status: StatusHistory[]): string {
        let orderStatus: string = '';
        let orderId: number = -1;
        status.forEach((el) => {
            if (orderId < el.status.id) {
                orderStatus = el.status.name;
                orderId = el.status.id;
            }
        });
        if (orderStatus == 'Paid') this.statusIcon = 'mdi-checkbox-marked-circle';
        if (orderStatus == 'Pending') this.statusIcon = 'mdi-information';
        return orderStatus.toUpperCase();
    }

    goToProfile(): void {
        this.$router.push('/profile');
    }

    async fetchOrders(): Promise<void> {
        await this.FETCH_ORDERS(this.GET_CLIENT_DATA.id!);
    }

    async mounted(): Promise<void> {
        await this.fetchOrders();
        console.log(this.GET_ORDERS);
    }

    async fetchProductsOrder(orderId: number): Promise<void> {
        await this.FETCH_ORDER_BY_ID(orderId);
    }

    async downloadInvoice(id: number) {
        await CustomersRepository.downloadFile(id);
    }

    @authModule.Getter(AuthTypes.getters.GET_CLIENT_DATA)
    private GET_CLIENT_DATA!: CustomerInterface;
    @payments.Action(PaymentsTypes.actions.FETCH_ORDERS)
    private FETCH_ORDERS!: (customerId: number) => boolean;
    @payments.Action(PaymentsTypes.actions.FETCH_ORDER_BY_ID)
    private FETCH_ORDER_BY_ID!: (orderId: number) => Promise<any>;
    @payments.Getter(PaymentsTypes.getters.GET_ORDERS)
    private GET_ORDERS!: Orders[];
}
</script>

<style scoped></style>
