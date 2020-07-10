<template>
    <v-row>
        <v-col>
            <div class="d-flex justify-center">
                <v-img src="../../../assets/logo-header.png" height="300" contain></v-img>
            </div>
            <p class="mb-0 mt-12 primary--text title text-center">
                {{ $t('NOT_FOUND') }}
            </p>
            <div class="d-flex justify-center mt-6 mb-12">
                <v-icon color="primary" x-large>
                    mdi-magnify-remove-outline
                </v-icon>
            </div>
            <div class="d-flex justify-center mt-6 mb-12">
                <v-btn color="primary" @click="() => backToBuhocenter()">{{
                    $t('BACK_TO_BUHOCENTER')
                }}</v-btn>
            </div>
        </v-col>
    </v-row>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class NotFound extends Vue {
    backToBuhocenter(): void {
        this.$router.push('/home');
    }
}
</script>

<style></style>
