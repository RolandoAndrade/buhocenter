<template>
    <div>
        <v-card outlined class="pa-3 my-3 mx-12">
            <v-card-title>
                {{ $t('ADD_OFFER') }}
            </v-card-title>
            <div class="d-flex justify-center align-center mt-3">
                <v-text-field :label="nameLabel" class="mx-3" v-model="offerName"></v-text-field>
                <v-text-field
                    :label="percentageLabel"
                    min="1"
                    max="100"
                    type="number"
                    v-model="offerPercentage"
                ></v-text-field>
            </div>
            <v-text-field :label="descriptionLabel" class="mx-3" v-model="offerDescription"></v-text-field>
            <div class="d-flex justify-center mt-6 mb-3">
                <v-btn
                    @click="() => createOffer()"
                    color="primary"
                    :disabled="checkForm"
                    :loading="loading"
                    >{{ $t('CREATE_OFFER') }}</v-btn
                >
            </div>
        </v-card>
        <v-alert
            transition="slide-x-transition"
            type="info"
            elevation="1"
            class="my-3 mx-12"
            color="primary"
            dense
            :value="showFormWarning"
        >
            {{ $t('FORM_OFFER_WARNIG') }}
        </v-alert>
        <v-alert
            transition="slide-x-transition"
            type="warning"
            elevation="1"
            class="my-3 mx-12"
            color="orange darken-1"
            dense
            :value="showPercentageError"
        >
            {{ $t('FORM_OFFER_PERCENTAGE_WARNING') }}
        </v-alert>
        <v-snackbar v-model="addSuccess" top color="success" class="mt-12">
            {{ $t('OFFER_ADDED') }}
            <v-btn color="white" text @click="addSuccess = false">{{ $t('CLOSE') }}</v-btn>
        </v-snackbar>
        <v-snackbar v-model="addError" top color="error" class="mt-12">
            {{ $t('OFFER_ADD_ERROR') }}
            <v-btn color="white" text @click="addError = false">{{ $t('CLOSE') }}</v-btn>
        </v-snackbar>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { offers } from '@/store/namespaces';
import { Offer } from '../interfaces/offer.interface';
import OffersTypes from '@/store/offers/methods/offers.methods';
import { TranslateResult } from 'vue-i18n';

@Component
export default class CreateOffer extends Vue {
    addSuccess: boolean = false;
    loading: boolean = false;
    addError: boolean = false;
    showPercentageError: boolean = false;
    showFormWarning: boolean = true;
    offerName: string = '';
    offerPercentage: number = 1;
    offerDescription: string = '';

    @Watch('offerPercentage')
    checkPercentage(): void {
        if (this.offerPercentage <= 0 || this.offerPercentage > 100) {
            this.showPercentageError = true;
        } else {
            this.showPercentageError = false;
        }
    }

    @Watch('offerName')
    @Watch('offerDescription')
    checkInfoForm(): void {
        if (this.offerName == '' || this.offerDescription == '') {
            this.showFormWarning = true;
        } else {
            this.showFormWarning = false;
        }
    }

    async createOffer(): Promise<void> {
        this.loading = true;
        const offer: Offer = {
            id: undefined,
            createdAt: undefined,
            updatedAt: undefined,
            name: this.offerName,
            description: this.offerDescription,
            percentage: this.offerPercentage,
        };
        if (await this.CREATE_OFFER(offer)) {
            this.cleanForm();
            this.addSuccess = true;
            this.FETCH_OFFERS({ start: 1, limit: 1 });
        } else {
            this.addError = true;
        }
        this.loading = false;
    }

    validateForm(): boolean {
        if (
            this.offerName !== '' &&
            this.offerPercentage !== 0 &&
            this.offerPercentage > 0 &&
            this.offerPercentage <= 100 &&
            this.offerDescription !== ''
        ) {
            return true;
        } else {
            if (this.offerPercentage < 0 || this.offerPercentage > 100) {
                this.offerPercentage = 1;
                return false;
            } else {
                return false;
            }
        }
    }

    cleanForm(): void {
        this.offerPercentage = 1;
        this.offerDescription = '';
        this.offerName = '';
    }

    get checkForm(): boolean {
        if (this.validateForm()) {
            return false;
        } else {
            return true;
        }
    }

    get percentageLabel(): TranslateResult {
        return this.$t('OFFER_PERCENTAGE');
    }

    get nameLabel(): TranslateResult {
        return this.$t('OFFER_NAME');
    }

    get descriptionLabel(): TranslateResult {
        return this.$t('OFFER_DESCRIPTION');
    }

    @offers.Action(OffersTypes.actions.FETCH_OFFERS)
    private FETCH_OFFERS!: (payload: { start: number; limit: number }) => boolean;

    @offers.Action(OffersTypes.actions.CREATE_OFFER)
    private CREATE_OFFER!: (offer: Offer) => boolean;
}
</script>
<style></style>
