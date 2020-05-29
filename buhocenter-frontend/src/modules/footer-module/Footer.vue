<template>
    <v-footer
            primary
            padless
    >
        <v-card
                flat
                tile
                class="secondary lighten-1 white--text text-center"
                width="100%"
        >
            <v-card-text>
                <v-btn
                        v-for="icon in icons"
                        :key="icon"
                        class="mx-4 white--text"
                        icon
                >
                    <v-icon size="24px">{{ icon }}</v-icon>
                </v-btn>
            </v-card-text>

            <v-card-title class="justify-center" style="width: auto; height: auto;">
                <v-img src="../../assets/Logo-completo.png" class="img-header-form" width="150" height="150" contain></v-img>
            </v-card-title>

            <v-divider></v-divider>

            <v-card-text class="white--text">
                {{ new Date().getFullYear() }} — <strong>Buhocenter</strong>
            </v-card-text>
        </v-card>
    </v-footer>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from "vue-class-component";

    @Component
    export default class Footer extends Vue {
        icons: string[] = [
            'mdi-facebook',
            'mdi-twitter',
            'mdi-linkedin',
            'mdi-instagram',
        ]


    }
</script>

<style>


</style>