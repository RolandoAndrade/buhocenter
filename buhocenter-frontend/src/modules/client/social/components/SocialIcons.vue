<template>
    <v-container class="mx-auto">
        <div class="d-flex justify-center">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" class="social">
                <v-icon class="primary--text px-1">mdi-twitter</v-icon>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="social">
                <v-icon class="primary--text px-1">mdi-instagram</v-icon>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="social">
                <v-icon class="primary--text px-1">mdi-facebook</v-icon>
            </a>
        </div>
    </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class SocialIcons extends Vue {}
</script>
