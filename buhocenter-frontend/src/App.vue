<template>
    <v-app id="inspire">
        <router-view class="app-font-global"></router-view>
    </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import './assets/css/style.css';

export default Vue.extend({
    name: 'App',

    data: () => ({}),
});
</script>

<style lang="scss">
.app-font-global {
    font-family: 'Questrial', sans-serif !important;
}

.title-2 {
    font-size: 20px !important;
    text-align: center;
    margin: 0 auto;
}
.title-1 {
    font-size: 40px !important;
    text-align: center;
    margin: 0 auto;
}
.line {
    margin: 0 auto;
    background-color: #907f46;
    width: 10%;
    height: 2.5px;
}
</style>
