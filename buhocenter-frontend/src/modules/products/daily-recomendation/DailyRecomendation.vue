<template>
    <v-container fluid style="background: #ffffff" class="pt-8 pb-8">
        <h3 class="text-center">{{$t('DAILY_RECOMMENDATION').toUpperCase()}}</h3>
            <v-slide-group
                    class="pa-4"
                    center-active
                    show-arrows
                    v-if="GET_PRODUCTS_DAILY_AND_PHOTOS_LOADED"
            >
                <v-slide-item
                        v-for="product of GET_PRODUCTS_DAILY"
                        :key="product.id"
                        v-slot:default="{ active, toggle }"
                >
                    <v-card
                            :color="active ? 'primary' : 'grey lighten-1'"
                            class="ma-4 "
                            height="600"
                            width="300"
                            @click="toggle"
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
                                        <v-col cols="12">
                                            <v-img
                                                    height="200"
                                                    contain
                                                    :src="product.photos[0]"
                                            ></v-img>
                                        </v-col>
                                        <v-col
                                                cols="9"
                                                class="pl-0 pb-0"
                                        >
                                            <v-row
                                                    class="flex-column ma-0 fill-height caption"
                                                    justify="center"
                                            >
                                                <p>{{$t('BY')}} <b>{{product.productProvider[0].provider.name}}</b></p>
                                            </v-row>
                                        </v-col>

                                        <v-col
                                                cols="9"
                                                class="pl-0 product-name"

                                        >
                                            <v-row
                                                    class="flex-column ma-0 fill-height caption product-name"
                                                    justify="center"
                                                    @click="getItemDetail(product)"
                                            >
                                                {{product.name}}
                                            </v-row>
                                        </v-col>

                                        <v-col
                                                cols="9"
                                                class="pl-0 pb-0"
                                        >
                                            <v-row
                                                    class="flex-column ma-0 fill-height title"
                                                    justify="center"
                                            >
                                                ${{ product.price }}
                                            </v-row>
                                        </v-col>

                                        <v-col
                                                cols="9"
                                                class="pl-0"
                                        >
                                            <v-row
                                                    class="flex-column ma-0 fill-height title ml-0 mr-0"
                                                    justify="center"
                                            >
                                                <v-rating
                                                        :value="getRating(product.productRatings)"
                                                        background-color="orange lighten-3"
                                                        color="primary"
                                                        :small="$vuetify.breakpoint.mdAndUp"
                                                        :x-small="$vuetify.breakpoint.mdAndDown"
                                                        readonly
                                                        :size="$vuetify.breakpoint.mdAndDown ? '3' : '30'"
                                                        :dense="$vuetify.breakpoint.mdAndDown"
                                                        half-increments
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
        <v-progress-linear
                v-else
                indeterminate
                primary
        ></v-progress-linear>
    </v-container>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import Categories from "@/modules/products/categories/Categories.vue";
    import AboutUs from "@/modules/about-us/aboutUs.vue";
    import {products} from "@/store/namespaces";
    import { FETCH_PRODUCTS_DAILY_DETAIL, FETCH_PRODUCTS_DAILY, FETCH_PRODUCTS_DAILY_DETAIL_PHOTOS } from '@/store/products/methods/products.actions';
    import { GET_PRODUCTS_DAILY, GET_PRODUCTS_DAILY_AND_PHOTOS_LOADED } from '@/store/products/methods/products.getters';
    import {SET_PRODUCT_DAILY_AND_PHOTOS_LOADED} from '@/store/products/methods/products.mutations'
    import {ITEM_TYPE} from "@/config/constants";
    @Component({
        components: {Categories,AboutUs}
    })
    export default class DailyRecommendation extends Vue {

        errorLoadingContent: boolean = false;

        async fetchProductsDaily() {
            this.SET_PRODUCT_DAILY_AND_PHOTOS_LOADED(false);
            const fetched: boolean = await this.FETCH_PRODUCTS_DAILY();
            if (!fetched) {
                this.errorLoadingContent = true;
            } else {
                await this.FETCH_PRODUCTS_DAILY_DETAIL_PHOTOS(this.GET_PRODUCTS_DAILY);
            }
        }

        getItemDetail(item): void {
            this.$router.push({ name: 'item-detail', query: { item: 'product', id: item.id } })
            this.$router.go(0);
        }

        getRating(productRatings): number {
            return productRatings[0] ? productRatings[0].rating : 0;
        }

        async mounted(){
            await this.fetchProductsDaily();
        }

        @products.Mutation(SET_PRODUCT_DAILY_AND_PHOTOS_LOADED) SET_PRODUCT_DAILY_AND_PHOTOS_LOADED;
        @products.Action(FETCH_PRODUCTS_DAILY_DETAIL) FETCH_PRODUCTS_DAILY_DETAIL;
        @products.Action(FETCH_PRODUCTS_DAILY) FETCH_PRODUCTS_DAILY;
        @products.Action(FETCH_PRODUCTS_DAILY_DETAIL_PHOTOS) FETCH_PRODUCTS_DAILY_DETAIL_PHOTOS;
        @products.Getter(GET_PRODUCTS_DAILY) GET_PRODUCTS_DAILY;
        @products.Getter(GET_PRODUCTS_DAILY_AND_PHOTOS_LOADED) GET_PRODUCTS_DAILY_AND_PHOTOS_LOADED;

    }
</script>

<style>

    .card-product-recomendation{
        box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)
    }

    .product-name{
        cursor: pointer;
    }

    .product-name:hover{
        text-decoration: underline;
        color: #907F46;
    }
</style>