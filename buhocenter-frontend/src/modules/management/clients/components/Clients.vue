<template>
    <v-container>
        <ClientsInfo />
    </v-container>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ClientsInfo from './ClientsInfo.vue';
@Component({
    components: {
        ClientsInfo,
    },
})
export default class DashboardClients extends Vue {}
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
