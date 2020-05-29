<template>
    <div class="container-page" style="position: relative">
        <h2>Platform</h2>
    </div>
</template>
<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    @Component
    export default class DashboardPlatform extends Vue {

    }
</script>
<style>

    .container-page{
        position: relative;
        width: 100%;
        padding: 0;
    }
    .v-image__image--contain {
        background-position-y: 38% !important;
    }

    @media only screen and (max-width: 600px) {
        .v-window__prev, .v-window__next {
            top: calc(40% - 20px) !important;
        }
    }



</style>
