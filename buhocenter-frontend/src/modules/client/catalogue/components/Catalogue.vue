<template>
    <v-row>
        <Aside @refreshProducts="refreshProducts" />

        <v-col cols="12" lg="9" md="9" sm="12">
            <v-container fluid>
                <EmptyState class="mt-12" v-if="this.GET_TOTAL_PRODUCTS == 0" :message="emptyMessage" />
                <ProductCard />
                <v-pagination
                    class="mt-6"
                    v-if="HowManyPages > 0 && GET_PRODUCTS_AND_PHOTOS_LOADED"
                    color="primary"
                    v-model="page"
                    :length="getLength"
                    :total-visible="7"
                ></v-pagination>
            </v-container>
        </v-col>
        <v-snackbar v-model="errorLoadingContent" top :timeout="timeout" color="error">
            {{ $t('ERROR_LOAD_PRODUCTS') }}
            <v-btn color="white" text @click="closeSnackbar">{{ $t('CLOSE') }}</v-btn>
        </v-snackbar>
    </v-row>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import ProductCard from './ProductCard.vue';
import EmptyState from '@/modules/common/components/EmptyState.vue';
import Aside from './Aside.vue';
import { products, layout } from '@/store/namespaces';
import ProductsTypes from '@/store/products/methods/products.methods';
import LayoutTypes from '@/store/layout/methods/layout.methods';
import { Watch } from 'vue-property-decorator';
import { Product } from '@/modules/client/products/interfaces/products.interface';
import { ProductFilters } from '../../products/interfaces/products.interface';

@Component({
    components: {
        ProductCard,
        Aside,
        EmptyState,
    },
})
export default class Catalogue extends Vue {
    page = 1;
    productsDisplayed = 9;
    timeout = 5000;
    errorLoadingContent = false;
    emptyMessage = 'NO_PRODUCTS';

    @Watch('page')
    async changePage() {
        await this.fetchProducts({ start: this.page });
    }

    async refreshProducts(data: ProductFilters): Promise<any> {
        await this.fetchProducts(data);
    }

    closeSnackbar() {
        this.errorLoadingContent = false;
    }

    get getLength() {
        const length: number = this.HowManyPages + 1;

        if (length < 0) {
            return 1;
        }

        return length;
    }

    get HowManyPages() {
        return Math.floor(this.GET_TOTAL_PRODUCTS / this.productsDisplayed);
    }

    async fetchProducts(data: ProductFilters) {
        this.SET_PRODUCT_PHOTOS_NOT_LOADED(false);
        const fetched: boolean = await this.FETCH_PRODUCTS(data);
        if (!fetched) {
            this.errorLoadingContent = true;
        } else {
            await this.FETCH_PRODUCT_PHOTO_BY_NAME(this.GET_PRODUCTS);
        }
    }

    async mounted() {
        if (this.$route.query.category_id) await this.fetchProducts({ catalogueId: this.GET_CATALOGUE_ID });
        else if (this.$router.currentRoute.fullPath === '/products') await this.fetchProducts({});
    }

    @products.Action(ProductsTypes.actions.FETCH_PRODUCTS) private FETCH_PRODUCTS;
    @products.Action(ProductsTypes.actions.FETCH_PRODUCT_PHOTO_BY_NAME)
    private FETCH_PRODUCT_PHOTO_BY_NAME!: (products: Product[]) => boolean;
    @products.Action(ProductsTypes.actions.SET_PRODUCT_PHOTOS_NOT_LOADED)
    private SET_PRODUCT_PHOTOS_NOT_LOADED!: (loaded: boolean) => boolean;
    @products.Getter(ProductsTypes.getters.GET_PRODUCTS)
    private GET_PRODUCTS!: Product[];
    @products.Getter(ProductsTypes.getters.GET_TOTAL_PRODUCTS)
    private GET_TOTAL_PRODUCTS!: number;
    @products.Getter(ProductsTypes.getters.GET_PRODUCTS_AND_PHOTOS_LOADED)
    GET_PRODUCTS_AND_PHOTOS_LOADED!: boolean;

    @layout.Getter(LayoutTypes.getters.GET_CATALOGUE_ID)
    private GET_CATALOGUE_ID?: number;
}
</script>
