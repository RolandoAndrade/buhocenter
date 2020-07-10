<template>
    <v-menu offset-y bottom>
        <template v-slot:activator="{ on }">
            <v-btn color="primary" dark v-on="on" outlined>
                {{ $currency.getCurrentSymbol() }}
            </v-btn>
        </template>
        <v-list>
            <v-list-item
                v-for="(item, i) in this.$currency.getAvailableCurrencies()"
                :key="i"
                @click="() => changeCurrency(item.iso)"
            >
                <v-row>
                    <v-col cols="4">
                        {{ item.symbol }}
                    </v-col>
                    <v-col cols="8">{{ item.iso }}</v-col>
                </v-row>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { CurrencyRepositoryInterface } from '@/plugins/currency/currency.repository.interface';

@Component({})
export default class CurrencySelector extends Vue {
    $currency!: CurrencyRepositoryInterface;

    changeCurrency(currency: string) {
        this.$currency.setCurrency(currency);
    }
}
</script>

<style scoped></style>
