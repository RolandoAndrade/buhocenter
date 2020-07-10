<template>
    <v-row justify="center">
        <v-dialog v-model="showModal" persistent max-width="490">
            <template v-slot:activator="{ on }">
                <v-btn
                    v-if="product.productRatings.length == 0 && rated == false"
                    color="primary"
                    class="white--text overline"
                    v-on="on"
                    >{{ $t('RATE_PRODUCT_TEXT') }}</v-btn
                >
                <v-btn v-else color="primary" outlined class="primary--text overline">
                    {{ $t('PRODUCT_RATED_TEXT') }}
                </v-btn>
            </template>
            <v-card>
                <v-card-title class="headline">{{ product.name }}</v-card-title>
                <v-card-text class="overline mb-4">{{ product.provider.name }}</v-card-text>
                <v-card-text class="indigo--text" v-if="emptyReview">
                    {{ $t('REVIEW_TEXT_ERROR') }}
                </v-card-text>
                <v-card-text class="indigo--text" v-if="emptyRating">
                    {{ $t('RATING_TEXT_ERROR') }}
                </v-card-text>
                <v-textarea
                    filled
                    auto-grow
                    v-model="review"
                    label="Review"
                    rows="4"
                    row-height="20"
                    class="mx-12"
                ></v-textarea>
                <v-rating
                    class="d-flex justify-center mb-5"
                    v-model="rating"
                    color="yellow darken-3"
                    background-color="grey darken-1"
                    empty-icon="$ratingFull"
                    hover
                ></v-rating>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="closeModal">{{ $t('CLOSE') }}</v-btn>
                    <v-btn color="primary" text @click="createRating()">{{ $t('ADD_REVIEW_TEXT') }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { authModule, products } from '@/store/namespaces';
import { CustomerInterface } from '@/modules/client/auth/interfaces/customer.interface';
import ProductsTypes from '@/store/products/methods/products.methods';
import AuthTypes from '../../../../store/auth/methods/auth.methods';
import { ProductRatingCreate } from '../../../client/products/interfaces/products.interface';

@Component({
    components: {},
})
export default class RateProduct extends Vue {
    showModal = false;
    review = '';
    rating = 0;
    emptyReview = false;
    emptyRating = false;
    loading = true;
    rated = false;

    @Prop() product!: any;
    @Prop() alreadyRated!: boolean;

    @Watch('alreadyRated')
    load(): void {
        this.loading = false;
    }

    closeModal(): void {
        this.showModal = false;
        this.emptyReview = false;
        this.emptyRating = false;
        this.review = '';
        this.rating = 0;
    }

    async createRating(): Promise<void> {
        this.emptyReview = false;
        this.emptyRating = false;

        if (this.review === '') this.emptyReview = true;
        if (this.rating === 0) this.emptyRating = true;

        if (this.review != '' && this.rating > 0) {
            var hoy = new Date();
            var dd = hoy.getDate();
            var mm = hoy.getMonth() + 1;
            var yyyy = hoy.getFullYear();
            var date: string = yyyy + '-' + mm + '-' + dd;

            const rating: ProductRatingCreate = {
                rating: this.rating,
                comment: this.review,
                date,
                product: {
                    id: this.product.id,
                },
                user: {
                    id: this.GET_CLIENT_DATA.id!,
                },
            };

            if (await this.CREATE_PRODUCT_RATING(rating)) {
                this.showModal = false;
                this.emptyReview = false;
                this.emptyRating = false;
                this.rated = true;
            }
        }
    }

    @authModule.Getter(AuthTypes.getters.GET_CLIENT_DATA)
    private GET_CLIENT_DATA!: CustomerInterface;
    @products.Action(ProductsTypes.actions.CREATE_PRODUCT_RATING) CREATE_PRODUCT_RATING!: (
        productRating: ProductRatingCreate,
    ) => boolean;
}
</script>

<style lang="scss"></style>
