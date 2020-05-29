<template>
  <v-app >
    <router-view class="app-font-global"></router-view>
  </v-app>
</template>

<script lang="ts">
  import Vue from 'vue';
  import './assets/css/style.css'

  export default Vue.extend({
    name: 'App',

    data: () => ({
      //
    }),
  });
</script>

<style>
  .app-font-global{
    font-family: 'Questrial', sans-serif !important;
  }
</style>
