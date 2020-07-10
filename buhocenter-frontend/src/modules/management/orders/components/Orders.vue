<template>
    <v-row>
        <v-col class="d-flex justify-center">
            <h2>{{ $t('ORDERS') }}</h2>
        </v-col>
    </v-row>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
@Component
export default class DashboardOrders extends Vue {}
</script>
<style>
.container-page {
    position: relative;
    width: 100%;
    padding: 0;
}
.v-image__image--contain {
    background-position-y: 38% !important;
}

@media only screen and (max-width: 600px) {
    .v-window__prev,
    .v-window__next {
        top: calc(40% - 20px) !important;
    }
}
</style>
