<template>
    <v-container>
        <v-row>
            <v-col class="d-flex justify-center">
                <h2>{{ $t('ORDERS') }}</h2>
            </v-col>
        </v-row>
        <v-divider v-if="!showPagination"></v-divider>
        <v-row v-if="!showPagination">
            <v-col>
                <v-alert
                    type="info"
                    elevation="1"
                    class="my-3 mx-12"
                    color="primary"
                    dense
                    transition="slide-x-transition"
                >
                    {{ $t('NO_ADMIN_ORDERS') }}
                </v-alert>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <OrderComponent v-for="order in reverseOrders" :key="order.id" v-bind:order="order" />
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-pagination v-model="page" :length="totalPages" v-if="showPagination"></v-pagination>
            </v-col>
        </v-row>
    </v-container>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { orders } from '@/store/namespaces';
import { Order } from '@/modules/management/orders/interfaces/orders.interface';
import OrdersTypes from '@/store/orders/methods/orders.methods';
import OrderComponent from '@/modules/management/orders/components/Order.vue';

@Component({
    components: {
        OrderComponent,
    },
})
export default class DashboardOrders extends Vue {
    page: number = 1;
    start: number = 1;
    limit: number = 5;

    mounted(): void {
        this.FETCH_ORDERS({ start: this.start, limit: this.limit });
    }

    @Watch('page')
    async setPagination(page: number): Promise<void> {
        this.start = this.page;
        await this.FETCH_ORDERS({ start: this.start, limit: this.limit });
    }

    get showPagination(): boolean {
        return this.QUANTITY > 0 ? true : false;
    }

    get totalPages(): number {
        if (this.QUANTITY / this.limit > Math.round(this.QUANTITY / this.limit)) {
            return Math.round(this.QUANTITY / this.limit) + 1;
        } else {
            return Math.round(this.QUANTITY / this.limit);
        }
    }

    get reverseOrders(): Order[] {
        return this.orders.reverse();
    }

    @orders.Action(OrdersTypes.actions.FETCH_ORDERS)
    private FETCH_ORDERS!: (payload: { start: number; limit: number }) => boolean;

    @orders.Getter(OrdersTypes.getters.GET_ORDERS)
    private orders!: Order[];

    @orders.Getter(OrdersTypes.getters.GET_ORDERS_QUANTITY)
    private QUANTITY!: number;
}
</script>
<style lang="scss" scoped>
.no-orders {
    text-align: center;
    color: rgb(133, 133, 133);
    font-size: 25px;
    font-style: unset;
    margin: 100px auto;
}
</style>
