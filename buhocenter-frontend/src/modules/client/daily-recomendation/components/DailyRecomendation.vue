<template>
    <v-container fluid style="background: #ffffff;" class="pt-8 pb-8">
        <h2 class="text-center">{{ $t('DAILY_RECOMMENDATION').toUpperCase() }}</h2>
        <v-slide-group class="pa-4" center-active show-arrows v-if="GET_PRODUCTS_DAILY_AND_PHOTOS_LOADED">
            <v-slide-item v-for="product of GET_PRODUCTS_DAILY" :key="product.id" v-slot:default="{ active }">
                <v-card
                    :color="active ? 'primary' : 'grey lighten-1'"
                    class="ma-4"
                    height="450"
                    width="250"
                    @click="getItemDetail(product)"
                >
                    <v-row
                        class="fill-height card-product-recomendation"
                        align="center"
                        justify="center"
                        style="background: #ffffff;"
                    >
                        <v-scale-transition>
                            <v-container>
                                <v-row justify="center">
                                    <v-col cols="12" lg="12" md="6" sm="4">
                                        <v-img height="200" contain :src="product.productPhotos[0]"></v-img>
                                    </v-col>
                                    <v-col cols="9" class="pl-0 pb-0 pt-0">
                                        <v-row class="flex-column ma-0 fill-height caption" justify="center">
                                            <p>
                                                {{ $t('BY') }}
                                                <b>{{ product.provider.name }}</b>
                                            </p>
                                        </v-row>
                                    </v-col>

                                    <v-col cols="9" class="pl-0 product-name">
                                        <v-row
                                            class="flex-column ma-0 fill-height caption product-name text-justify"
                                            justify="center"
                                        >
                                            {{ getName(product) }}
                                        </v-row>
                                    </v-col>

                                    <v-col cols="9" class="pl-0 pb-0 pt-0">
                                        <div
                                            class="ma-0 mb-2"
                                            style="
                                                display: flex;
                                                align-items: center;
                                                justify-content: space-between;
                                            "
                                        >
                                            <div class="mr-4" style="bottom: 0; font-size: 20px;">
                                                {{ product.price | getCurrentExchangeWithSymbolFor }}
                                            </div>
                                            <div
                                                v-if="product.tentativePoints"
                                                style="display: flex; align-items: center; font-size: 15px;"
                                            >
                                                <img src="@/assets/petromiles-small.png" class="mr-2" />
                                                <div style="font-size: 15px;">
                                                    {{ product.tentativePoints }} pts
                                                </div>
                                            </div>
                                        </div>
                                    </v-col>

                                    <v-col cols="9" class="pr-0">
                                        <v-row
                                            class="flex-column ma-0 fill-height title ml-0 mr-0"
                                            justify="center"
                                        >
                                            <v-rating
                                                :value="parseInt(product.rating)"
                                                background-color="orange lighten-3"
                                                color="primary"
                                                :small="$vuetify.breakpoint.mdAndUp"
                                                :x-small="$vuetify.breakpoint.mdAndDown"
                                                readonly
                                                :size="$vuetify.breakpoint.mdAndDown ? '3' : '30'"
                                                :dense="$vuetify.breakpoint.mdAndDown"
                                                half-increments
                                                style="position: absolute; bottom: 0;"
                                                class="mb-3"
                                            ></v-rating>
                                        </v-row>
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-scale-transition>
                    </v-row>
                </v-card>
            </v-slide-item>
        </v-slide-group>
        <v-progress-linear v-else indeterminate primary></v-progress-linear>
    </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Categories from '@/modules/client/categories/components/Categories.vue';
import AboutUs from '@/modules/client/about-us/components/AboutUs.vue';
import { products } from '@/store/namespaces';
import ProductsTypes from '@/store/products/methods/products.methods';
import { Product } from '@/modules/client/products/interfaces/products.interface';
@Component({
    components: { Categories, AboutUs },
})
export default class DailyRecommendation extends Vue {
    errorLoadingContent = false;

    async fetchProductsDaily(): Promise<void> {
        this.SET_PRODUCT_DAILY_AND_PHOTOS_LOADED(false);
        const fetched: boolean = await this.FETCH_PRODUCTS_DAILY();
        if (!fetched) {
            this.errorLoadingContent = true;
        } else {
            await this.FETCH_PRODUCTS_DAILY_DETAIL_PHOTOS(this.GET_PRODUCTS_DAILY);
        }
    }

    getItemDetail(item): void {
        this.$router.push({
            name: 'item-detail',
            query: { item: 'product', id: item.id },
        });
        this.$router.go(0);
    }

    getName(product: Product): string | undefined {
        return product.name!.length < 70 ? product.name : product.name!.substr(0, 70)! + '...';
    }

    getRating(productRatings: Product): number {
        return productRatings[0] ? parseInt(productRatings[0].rating) : 0;
    }

    async mounted() {
        await this.fetchProductsDaily();
    }

    @products.Mutation(ProductsTypes.mutations.SET_PRODUCT_DAILY_AND_PHOTOS_LOADED)
    SET_PRODUCT_DAILY_AND_PHOTOS_LOADED;
    @products.Action(ProductsTypes.actions.FETCH_PRODUCTS_DAILY)
    FETCH_PRODUCTS_DAILY!: () => boolean;
    @products.Action(ProductsTypes.actions.FETCH_PRODUCTS_DAILY_DETAIL_PHOTOS)
    FETCH_PRODUCTS_DAILY_DETAIL_PHOTOS!: (products: Product[]) => boolean;
    @products.Getter(ProductsTypes.getters.GET_PRODUCTS_DAILY)
    GET_PRODUCTS_DAILY!: Product[];
    @products.Getter(ProductsTypes.getters.GET_PRODUCTS_DAILY_AND_PHOTOS_LOADED)
    GET_PRODUCTS_DAILY_AND_PHOTOS_LOADED!: boolean;
}
</script>

<style>
.card-product-recomendation {
    box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14),
        0px 1px 5px 0px rgba(0, 0, 0, 0.12);
}

.product-name {
    cursor: pointer;
}

.product-name:hover {
    text-decoration: underline;
    color: #907f46;
}

.in-line {
    display: flex;
    align-items: center;
}

.space {
    justify-content: space-between;
}
</style>
