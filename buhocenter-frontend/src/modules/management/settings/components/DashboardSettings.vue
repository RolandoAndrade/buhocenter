<template>
    <v-container>
        <v-row>
            <v-col class="d-flex justify-center">
                <h2>{{ $t('SETTINGS_TITLE') }}</h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="mx-12">
                <v-card class="d-flex justify-space-between align-center mb-3 px-3 py-6 mx-12" elevation="3">
                    <v-text-field
                        label="Service fee ($)"
                        class="mx-3"
                        type="number"
                        v-model="serviceFee"
                    ></v-text-field>
                    <v-text-field
                        label="Processor fee ($)"
                        class="mx-3"
                        type="number"
                        v-model="processorFee"
                    ></v-text-field>
                    <v-btn
                        color="primary"
                        class="mx-3"
                        @click="() => updateCommissions()"
                        :disabled="availableUpdate"
                        :loading="updatedLoading"
                        >{{ $t('SETTINGS_UPDATE') }}</v-btn
                    >
                    <v-tooltip bottom class="mx-3" max-width="200">
                        <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on">
                                mdi-information-outline
                            </v-icon>
                        </template>
                        <span>
                            <p class="text-center">
                                {{ $t('SETTINGS_TOOLTIP') }}
                            </p></span
                        >
                    </v-tooltip>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="mx-12">
                <h3 class="mx-12">{{ $t('SETTINGS_HISTORY') }}</h3>
                <v-divider class="mx-12"></v-divider>
            </v-col>
        </v-row>
        <v-row>
            <v-col class="mx-12">
                <v-card
                    class="mb-3 pa-3 mx-12"
                    elevation="3"
                    v-for="commission in lastCommissions"
                    :key="parseInt(commission.id)"
                >
                    <v-row>
                        <v-col>
                            <p class="my-0">
                                <b>{{ $t('SETTINGS_SERVICE') }}</b> ${{ commission.serviceFee }}
                            </p>
                            <p class="my-0">
                                <b>{{ $t('SETTINGS_PROCESSOR') }}</b> ${{ commission.processorFee }}
                            </p>
                        </v-col>
                        <v-col cols="2">
                            <v-divider vertical></v-divider>
                        </v-col>
                        <v-col class="d-flex align-center justify-center">
                            <p class="my-0">
                                <b>{{ $t('SETTINGS_UPDATEDAT') }}</b> {{ formatDate(commission.updatedAt) }}
                            </p>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
        <v-snackbar v-model="addSuccess" top color="success" class="mt-12">
            {{ $t('SETTINGS_SUCCESS') }}
            <v-btn color="white" text @click="addSuccess = false">{{ $t('CLOSE') }}</v-btn>
        </v-snackbar>
        <v-snackbar v-model="addError" top color="error" class="mt-12">
            {{ $t('SETTINGS_ERROR') }}
            <v-btn color="white" text @click="addError = false">{{ $t('CLOSE') }}</v-btn>
        </v-snackbar>
    </v-container>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { settings } from '@/store/namespaces';
import { trunc } from '@/utils/global-functions';
import moment from 'moment';
import SettingsTypes from '@/store/settings/methods/settings.methods';
import { Commission } from '@/modules/management/settings/interfaces/commissions.interface';

@Component
export default class DashboardSettings extends Vue {
    addSuccess: boolean = false;
    addError: boolean = false;
    updatedLoading: boolean = false;
    serviceFee: any = 0;
    processorFee: any = 0;

    mounted(): void {
        this.FETCH_COMMISSIONS();
    }

    async updateCommissions(): Promise<void> {
        this.updatedLoading = true;
        const commission: Commission = {
            id: undefined,
            updatedAt: undefined,
            createdAt: undefined,
            serviceFee: trunc(this.serviceFee, 2),
            processorFee: trunc(this.processorFee, 2),
        };
        if (await this.CREATE_COMMISSION(commission)) {
            this.updatedLoading = false;
            this.addSuccess = true;
            this.serviceFee = 0;
            this.processorFee = 0;
            this.FETCH_COMMISSIONS();
        } else {
            this.addError = false;
        }
    }

    @Watch('serviceFee')
    @Watch('processorFee')
    formatInput(): void {
        if (this.serviceFee < 0) {
            this.serviceFee = 0;
        }

        if (this.processorFee < 0) {
            this.processorFee = 0;
        }

        if (this.checkDecimals(this.processorFee)) {
            this.processorFee = trunc(this.processorFee, 1);
        }

        if (this.checkDecimals(this.serviceFee)) {
            this.serviceFee = trunc(this.serviceFee, 1);
        }
    }

    checkDecimals(num: number): boolean {
        let numStr = num.toString();
        let decimalStr = numStr.split('.')[1] === undefined ? '' : numStr.split('.')[1];
        if (decimalStr.length > 2) {
            return true;
        } else {
            return false;
        }
    }

    formatDate(date: string): string {
        return moment(date).format('DD/MM/YYYY - HH:MM:SS');
    }

    get lastCommissions(): Array<Commission> {
        return this.COMMISSIONS.reverse();
    }

    get availableUpdate(): boolean {
        if (this.serviceFee > 0 || this.processorFee > 0) {
            return false;
        } else {
            return true;
        }
    }

    @settings.Action(SettingsTypes.actions.FETCH_COMMISSIONS)
    private FETCH_COMMISSIONS!: () => boolean;

    @settings.Action(SettingsTypes.actions.CREATE_COMMISSION)
    private CREATE_COMMISSION!: (commission: Commission) => boolean;

    @settings.Getter(SettingsTypes.getters.GET_COMMISSIONS)
    private COMMISSIONS!: Commission[];
}
</script>
<style></style>
