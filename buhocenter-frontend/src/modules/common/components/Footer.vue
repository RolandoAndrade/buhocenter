<template>
    <v-footer app absolute class="pa-0">
        <v-card flat tile class="secondary lighten-1 white--text text-center" width="100%">
            <v-card-text>
                <v-btn
                    v-for="(social_icon, index) in icons"
                    :key="index + '-icon'"
                    class="mx-4 white--text"
                    icon
                >
                    <a :href="social_icon.url" target="_blank" style="text-decoration: none;">
                        <v-icon size="24px">{{ social_icon.icon }}</v-icon>
                    </a>
                </v-btn>
            </v-card-text>

            <v-card-title class="justify-center" style="width: auto; height: auto;">
                <v-img
                    src="../../../assets/Logo-completo.png"
                    class="img-header-form"
                    width="150"
                    height="150"
                    contain
                ></v-img>
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
import Component from 'vue-class-component';

@Component
export default class Footer extends Vue {
    icons: { url: string; icon: string }[] = [
        { icon: 'mdi-facebook', url: 'https://www.facebook.com' },
        { icon: 'mdi-twitter', url: 'https://www.twitter.com' },
        { icon: 'mdi-linkedin', url: 'https://www.linkedin.com' },
        { icon: 'mdi-instagram', url: 'https://www.instagram.com' },
    ];
}
</script>

<style></style>
