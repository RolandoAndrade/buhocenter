<template>
    <div class="container-page" style="position: relative;">
        <v-row>
            <v-col class="d-flex justify-center">
                <h2>{{ $t('PRODUCTS') }}</h2>
            </v-col>
        </v-row>
        <v-row v-if="$vuetify.breakpoint.smAndDown && !management">
            <v-col class="d-flex justify-center">
                <v-btn @click="createProduct" color="primary" dark class>{{ $t('NEW_PRODUCT') }}</v-btn>
            </v-col>
        </v-row>
        <v-data-table
            v-if="!management"
            :headers="headers"
            :items="GET_ALL_PRODUCTS"
            :search="search"
            class="elevation-1 mx-6"
        >
            <template v-slot:top>
                <v-toolbar flat color="white">
                    <v-row>
                        <v-col class="d-flex justify-end">
                            <v-text-field
                                v-model="search"
                                append-icon="mdi-magnify"
                                :label="$t('SEARCH')"
                                single-line
                                hide-details
                                :full-width="false"
                                class="mr-12"
                            ></v-text-field>
                        </v-col>
                        <v-col v-if="$vuetify.breakpoint.mdAndUp" class="d-flex justify-end">
                            <v-btn @click="createProduct" color="primary" dark class="mb-2 mr-12">{{
                                $t('NEW_PRODUCT')
                            }}</v-btn>
                        </v-col>
                    </v-row>
                </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon class="mr-2" @click="editProduct(item)">
                    mdi-pencil
                </v-icon>
            </template>
            <template v-slot:no-data>
                <v-btn color="primary">{{ $t('RESET') }}</v-btn>
            </template>
        </v-data-table>
        <ProductManagement
            v-if="management"
            :item="item"
            @showAllProducts="showAllProducts"
            @showSuccessCreate="createSuccess = true"
            @showSuccessUpdate="updateSuccess = true"
            @showError="errorEvent"
        />
        <v-snackbar v-model="createSuccess" top color="success">
            {{ $t('PRODUCT_CREATED') }}
            <v-btn color="white" text @click="createSuccess = false">{{ $t('CLOSE') }}</v-btn>
        </v-snackbar>
        <v-snackbar v-model="updateSuccess" top color="success">
            {{ $t('PRODUCT_UPDATED') }}
            <v-btn color="white" text @click="updateSuccess = false">{{ $t('CLOSE') }}</v-btn>
        </v-snackbar>
        <v-snackbar v-model="errorCreate" top color="error">
            {{ $t('ERROR_CREATE_PRODUCT') }}
            <v-btn color="white" text @click="errorCreate = false">{{ $t('CLOSE') }}</v-btn>
        </v-snackbar>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ProductsTypes from '@/store/products/methods/products.methods';
import BrandsTypes from '@/store/brands/methods/brands.methods';
import ProvidersTypes from '@/store/providers/methods/providers.methods';
import { brands, providers, categoryModule, products, catalogueModule } from '../../../../store/namespaces';
import {
    ProductCreate,
    dimensionDto,
    ProductPhotoDto,
    InventoryProduct,
    Product,
} from '../../../client/products/interfaces/products.interface';
import CategoriesMethods from '@/store/categories/methods/categories.methods';
import CatalogueMethods from '@/store/catalogue/methods/catalogue.methods';
import { BrandInterface } from '../../../client/brand/interfaces/brand.interface';
import { Catalogues, ProductCatalogue } from '../../../client/catalogues/interfaces/catalogues.interface';
import { Category } from '../../../client/categories/interfaces/categories.interface';
import { Provider } from '../../../client/provider/interfaces/provider.interface';
import ProductManagement from './ProductManagement.vue';
import { ProductFilters } from '@/modules/client/products/interfaces/products.interface';

@Component({
    components: { ProductManagement },
})
export default class DashboardProducts extends Vue {
    dialog = false;
    timeout: number = 5000;
    search = '';
    management = false;
    item;
    createSuccess = false;
    updateSuccess = false;
    errorCreate = false;

    errorFetchingProducts: boolean = false;

    errorEvent(): void {
        this.errorCreate = true;
        this.showAllProducts();
    }

    async showAllProducts(): Promise<void> {
        await this.FETCH_ALL_PRODUCTS({ start: 1, limit: 100, admin: true });
        this.management = !this.management;
    }

    responsive(): number {
        const { xs, sm } = this.$vuetify.breakpoint;
        return xs || sm ? 12 : 5;
    }

    responsiveBtn(): number {
        const { xs, sm } = this.$vuetify.breakpoint;
        return xs || sm ? 12 : 2;
    }

    headers = [
        { text: 'Product Name', value: 'name' },
        { text: 'Provider', value: 'provider.name' },
        { text: 'Price', value: 'price' },
        { text: 'Status', value: 'status.name' },
        { text: 'Inventory', value: 'productInventory.availableQuantity' },
        { text: 'Actions', value: 'actions', sortable: false },
    ];

    createProduct(): void {
        this.management = true;
        this.item = null;
    }

    editProduct(item: Product): void {
        this.management = true;
        this.item = item;
    }

    async mounted(): Promise<void> {
        await this.FETCH_ALL_PRODUCTS({ start: 1, limit: 100, admin: true });
    }

    @products.Getter(ProductsTypes.getters.GET_PRODUCTS)
    private GET_ALL_PRODUCTS!: () => Product[];
    @products.Action(ProductsTypes.actions.FETCH_PRODUCTS) private FETCH_ALL_PRODUCTS;
}
</script>

<style lang="scss" scoped>
.container-page {
    margin-top: 20px;
    position: relative;
    width: 100%;
    padding: 0;
}
.v-image__image--contain {
    background-position-y: 38% !important;
}
@media only screen and (max-width: 600px) {
    .v-window__prev,
    .v-window__next {
        top: calc(60% - 40px) !important;
    }
}
</style>
