<template>
    <v-row>
        <v-col>
            <p class="mb-0 mt-12 primary--text title text-center">
                {{ $t(message) }}
            </p>
            <div class="d-flex justify-center mt-6 mb-12">
                <v-icon color="primary" x-large>
                    mdi-magnify-remove-outline
                </v-icon>
            </div>
        </v-col>
    </v-row>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component
export default class EmptyState extends Vue {
    @Prop() message!: string;
}
</script>

<style></style>
