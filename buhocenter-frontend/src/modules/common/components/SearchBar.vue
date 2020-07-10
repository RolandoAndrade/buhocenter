<template>
    <div :class="'searchbar'">
        <div class="searchbar__input">
            <input
                :class="'input input' + getSize()"
                :placeholder="$t('SEARCH')"
                @keyup.enter="searchByName()"
                v-model="query"
            />
            <div class="icon" @click="searchByName()">
                <i class="fas fa-search"></i>
            </div>
        </div>
        <div :class="'popover popover' + getSize()" v-show="matches.length > 0 && query != ''">
            <div class="popover__options">
                <ul>
                    <li
                        class="popover__option"
                        v-for="(item, i) in matches"
                        :key="i"
                        @click="itemClicked(item.name, i)"
                    >
                        {{ getName(item.name) }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';
import { products, brands } from '@/store/namespaces';
import ProductsTypes from '@/store/products/methods/products.methods';
import BrandsTypes from '@/store/brands/methods/brands.methods';
import { Product } from '@/modules/client/products/interfaces/products.interface';
import { ProductFilters } from '../../client/products/interfaces/products.interface';
import { BrandInterface } from '@/modules/client/brand/interfaces/brand.interface';
import { getShortName } from '../../../utils/global-functions';

@Component({})
export default class SearchBar extends Vue {
    @Prop() size!: string;
    filter: ProductFilters = new ProductFilters();
    query = '';
    filterBy = 'name';
    errorLoadingContent = false;
    ejemplo;

    getSize(): string {
        if (this.size === 'mobile') return '__mobile';
        else return '__big';
    }

    itemClicked(name: string, i: number): void {
        if (name !== 'No products found') {
            this.filter.name = this.matches[i].name;
            this.searchProducts(this.filter);
        }
    }

    searchByName(): void {
        this.filter.name = this.query;
        if (this.query !== '') this.searchProducts(this.filter);
    }

    async searchProducts(data: ProductFilters): Promise<void> {
        if (this.$router.currentRoute.path !== '/dashboard/products') {
            if (this.$router.currentRoute.fullPath !== `/products?name=${this.query}`)
                this.$router.push(`/products?name=${this.query}`);
            this.SET_PRODUCT_PHOTOS_NOT_LOADED(false);

            const fetched: boolean = await this.FETCH_PRODUCTS(data);
            if (!fetched) {
                this.errorLoadingContent = true;
            } else {
                await this.FETCH_PRODUCT_PHOTO_BY_NAME(this.GET_PRODUCTS);
            }
            this.query = '';
        }
    }

    get filteredProducts(): any {
        return this.GET_PRODUCTS.filter((item) =>
            item[this.filterBy].toLowerCase().includes(this.query.toLowerCase()),
        );
    }

    get matches(): any {
        if (this.query === '') return [];
        else if (this.query !== '' && this.filteredProducts.length === 0)
            return [{ name: 'No products found' }];
        return this.filteredProducts;
    }

    getName(name) {
        return getShortName(name, 30);
    }

    @Watch('$route', { immediate: true, deep: true })
    async onUrlChange(newVal: any) {
        if (
            this.$router.currentRoute.path !== '/products' &&
            this.$router.currentRoute.path !== '/dashboard/products'
        )
            await this.FETCH_PRODUCTS({});
    }

    @products.Action(ProductsTypes.actions.FETCH_PRODUCTS) private FETCH_PRODUCTS;
    @products.Getter(ProductsTypes.getters.GET_PRODUCTS) private GET_PRODUCTS!: Product[];

    @products.Action(ProductsTypes.actions.FETCH_PRODUCT_PHOTO_BY_NAME)
    private FETCH_PRODUCT_PHOTO_BY_NAME!: (products: Product[]) => boolean;
    @products.Action(ProductsTypes.actions.SET_PRODUCT_PHOTOS_NOT_LOADED)
    private SET_PRODUCT_PHOTOS_NOT_LOADED!: (loaded: boolean) => boolean;
}
</script>

<style scoped lang="scss">
.popover {
    position: absolute;
    z-index: 2;
    top: 35px;
    left: 0;
    background-color: white;
    border-radius: 0 0 10px 10px;
    box-shadow: 0 0 5px #987746;
    width: 100%;
    transition: all 0.2s;

    &__mobile {
        width: 200px;
        margin-left: 20px;
    }

    ul {
        padding: 0;
    }

    &__options {
        max-height: 200px;
        overflow-y: scroll;
    }

    &__option {
        //  border-radius: 5px;
        list-style: none;
        font-size: 16px;
        padding: 10px;
        transition: all 0.2s;
        cursor: pointer;
        &:hover {
            background-color: #9877465d;
            color: white;
        }
    }
}

.searchbar {
    position: relative;

    &__input {
        display: flex;
    }
}

.input {
    border: 1px solid #907f46;
    padding: 10px;
    height: 35px;
    outline: none;
    border-radius: 3px 0 0 3px;
    margin-right: 0;
    margin-left: 0 !important;
    box-shadow: 0 0 1.5px #907f46;

    transition: all 0.2s ease;

    &__big {
        width: 250px;
        &:focus {
            width: 300px;
        }
    }

    &__mobile {
        width: 200px;
        margin-left: 20px;
    }
}

.searchbar .icon {
    position: relative;
    width: 35px;
    height: 35px;
    background: #907f46;
    border-radius: 0px 3px 3px 0;
    color: #fff;
    cursor: pointer;
    &:hover {
        background: #987746;
    }
}

.searchbar .icon i {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    cursor: pointer;
}
</style>
