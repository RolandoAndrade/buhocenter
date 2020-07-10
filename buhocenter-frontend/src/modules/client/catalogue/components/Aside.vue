<template>
    <div>
        <div class="d-none d-md-flex d-lg-flex all">
            <v-navigation-drawer v-model="drawer" :mini-variant.sync="mini" permanent>
                <v-list-item class="px-2" v-if="this.$route.query.category_id">
                    <v-list-item-title class="overline ml-3 pa-4" v-if="getCategory !== '' && getCategory">
                        <RouterLink :to="`/catalogues?category_id=${getCategoryId}`">
                            {{ $t(getCategory) }}
                        </RouterLink>
                        <a class="pa-2 inline" v-if="getCatalogue !== '' && getCatalogue">
                            > {{ $t(getCatalogue) }}
                        </a>
                    </v-list-item-title>
                </v-list-item>

                <v-divider></v-divider>
                <v-list dense>
                    <v-list-item link @click="searchAll()">
                        <v-list-item-action class="ml-2">
                            <v-icon color="primary" style="font-size: 20px !important;"
                                >mdi-calendar-text-outline</v-icon
                            >
                        </v-list-item-action>
                        <v-list-item-content>
                            <v-list-item-title class="fs-sp">
                                {{ $t('ALL_PRODUCTS') }}
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                    <div v-for="(item, w) in list" :key="w">
                        <div class="ml-6 pa-2 subheader">{{ item.title }}</div>
                        <v-list-group v-for="(sec, j) in item.section" :key="j" @click="showCategory(sec)">
                            <template v-slot:appendIcon>
                                <v-icon style="font-size: 15px !important;">mdi-chevron-down</v-icon>
                            </template>
                            <template v-slot:activator>
                                <v-list-item-action>
                                    <v-icon x-small class="ml-2">{{ sec.icon }}</v-icon>
                                </v-list-item-action>
                                <v-list-item-content class="ml-n4">
                                    <v-list-item-title class="fs-sp">
                                        {{ $t(sec.term) }}
                                    </v-list-item-title>
                                </v-list-item-content>
                            </template>

                            <v-list-item-group>
                                <v-list-item
                                    v-for="(sub, k) in sec.catalogues"
                                    :key="k"
                                    class="pl-2"
                                    @click="showCatalogue(sub)"
                                >
                                    <v-list-item-action>
                                        <v-icon style="font-size: 10px !important;" class="ml-4"
                                            >mdi-square-small</v-icon
                                        >
                                    </v-list-item-action>
                                    <v-list-item-content>
                                        <v-list-item-title class="fs-sp">
                                            {{ $t(sub.term) }}</v-list-item-title
                                        >
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list-item-group>
                        </v-list-group>

                        <v-list-item-group mandatory v-model="model[0]">
                            <v-list-item
                                color="primary"
                                v-for="(child, i) in item.types"
                                :key="i"
                                @click="getProductsByPrice(child.price)"
                                link
                            >
                                <v-list-item-content>
                                    <v-list-item-title class="fs-sp ml-10"
                                        >{{ child.type }} {{ child.price | getCurrentExchangeWithSymbolFor }}
                                    </v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list-item-group>
                        <v-list-item-group mandatory v-model="model[1]">
                            <v-list-item
                                v-for="(child, i) in item.rating"
                                :key="i"
                                link
                                class="ml-4"
                                color="primary"
                                @click="getProductsByRating(child.value)"
                            >
                                <v-rating
                                    v-if="child.value"
                                    small
                                    v-model="child.value"
                                    readonly
                                    background-color="primary"
                                ></v-rating>
                                <v-list-item-content v-else>
                                    <v-list-item-title class="fs-sp ml-10">{{
                                        child.type
                                    }}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list-item-group>
                    </div>
                </v-list>
            </v-navigation-drawer>
        </div>
        <div v-if="showResponsive()">
            <v-bottom-sheet v-model="sheet" scrollable>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn color="primary" dark v-bind="attrs" v-on="on" fixed fab bottom right>
                        <v-icon>
                            mdi-filter-outline
                        </v-icon>
                    </v-btn>
                </template>
                <v-card>
                    <v-card-text>
                        <v-sheet class="text-center" height="400px">
                            <v-list-item class="px-2" v-if="this.$route.query.category_id">
                                <v-list-item-title
                                    class="overline ml-3 pa-4"
                                    v-if="getCategory !== '' && getCategory"
                                >
                                    <RouterLink :to="`/catalogues?category_id=${getCategoryId}`">
                                        {{ $t(getCategory) }}
                                    </RouterLink>
                                    <a class="pa-2 inline" v-if="getCatalogue !== '' && getCatalogue">
                                        > {{ $t(getCatalogue) }}
                                    </a>
                                </v-list-item-title>
                            </v-list-item>
                            <v-list dense>
                                <v-list-item link @click="searchAll()">
                                    <v-list-item-action class="ml-2">
                                        <v-icon color="primary" style="font-size: 20px !important;"
                                            >mdi-calendar-text-outline</v-icon
                                        >
                                    </v-list-item-action>
                                    <v-list-item-content>
                                        <v-list-item-title class="fs-sp">
                                            {{ $t('ALL_PRODUCTS') }}
                                        </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-divider class="mb-2"></v-divider>
                                <div v-for="(item, w) in list" :key="w">
                                    <div class="ml-6 pa-2 subheader">{{ item.title }}</div>
                                    <v-divider class="mb-2"></v-divider>
                                    <v-list-group
                                        v-for="(sec, j) in item.section"
                                        :key="j"
                                        @click="showCategory(sec)"
                                    >
                                        <template v-slot:appendIcon>
                                            <v-icon style="font-size: 15px !important;"
                                                >mdi-chevron-down</v-icon
                                            >
                                        </template>
                                        <template v-slot:activator>
                                            <v-list-item-action>
                                                <v-icon x-small class="ml-2">{{ sec.icon }}</v-icon>
                                            </v-list-item-action>
                                            <v-list-item-content class="ml-n4">
                                                <v-list-item-title class="fs-sp">
                                                    {{ $t(sec.term) }}
                                                </v-list-item-title>
                                            </v-list-item-content>
                                        </template>

                                        <v-list-item-group>
                                            <v-list-item
                                                v-for="(sub, k) in sec.catalogues"
                                                :key="k"
                                                class="pl-2"
                                                @click="showCatalogue(sub)"
                                            >
                                                <v-list-item-action>
                                                    <v-icon style="font-size: 10px !important;" class="ml-4"
                                                        >mdi-square-small</v-icon
                                                    >
                                                </v-list-item-action>
                                                <v-list-item-content>
                                                    <v-list-item-title class="fs-sp">
                                                        {{ $t(sub.term) }}</v-list-item-title
                                                    >
                                                </v-list-item-content>
                                            </v-list-item>
                                        </v-list-item-group>
                                    </v-list-group>

                                    <v-list-item-group mandatory v-model="model[0]">
                                        <v-list-item
                                            color="primary"
                                            v-for="(child, i) in item.types"
                                            :key="i"
                                            @click="getProductsByPrice(child.price)"
                                            link
                                        >
                                            <v-list-item-content>
                                                <v-list-item-title class="fs-sp ml-10"
                                                    >{{ child.type }} {{ child.price }}
                                                    {{ child.currency }}</v-list-item-title
                                                >
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-list-item-group>
                                    <v-list-item-group mandatory v-model="model[1]">
                                        <v-list-item
                                            v-for="(child, i) in item.rating"
                                            :key="i"
                                            link
                                            class="ml-4"
                                            color="primary"
                                            @click="getProductsByRating(child.value)"
                                        >
                                            <v-rating
                                                v-if="child.value"
                                                small
                                                v-model="child.value"
                                                readonly
                                                background-color="primary"
                                                class="mx-auto"
                                            ></v-rating>
                                            <v-list-item-content v-else>
                                                <v-list-item-title class="fs-sp ml-10">{{
                                                    child.type
                                                }}</v-list-item-title>
                                            </v-list-item-content>
                                        </v-list-item>
                                    </v-list-item-group>
                                </div>
                            </v-list>
                        </v-sheet>
                    </v-card-text>
                    <v-card-actions class="d-flex justify-center mt-6">
                        <v-btn outlined color="error" @click="sheet = !sheet">X</v-btn>
                    </v-card-actions>
                </v-card>
            </v-bottom-sheet>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { catalogueModule, layout, categoryModule } from '@/store/namespaces';
import CatalogueMethods from '@/store/catalogue/methods/catalogue.methods';
import CategoriesMethods from '@/store/categories/methods/categories.methods';
import { Catalogues as CataloguesInterface } from '@/modules/client/catalogues/interfaces/catalogues.interface';
import { Catalogue } from '@/modules/client/catalogues/interfaces/catalogues.interface';
import { Category } from '@/modules/client/categories/interfaces/categories.interface';
import LayoutTypes from '@/store/layout/methods/layout.methods';
import { ProductFilters } from '../../products/interfaces/products.interface';
import { Watch } from 'vue-property-decorator';

@Component
export default class Aside extends Vue {
    valor!: string;
    model = [0, 0];
    drawer = true;
    sheet = false;
    filter: ProductFilters = new ProductFilters();
    items = [
        { title: 'Home', icon: 'mdi-home-city' },
        { title: 'My Account', icon: 'mdi-account' },
        { title: 'Users', icon: 'mdi-account-group-outline' },
    ];
    mini = false;

    showResponsive(): boolean {
        const { xs, sm } = this.$vuetify.breakpoint;
        return xs || sm ? true : false;
    }

    get getCategory(): string {
        return this.GET_CATEGORY!;
    }

    get getCategoryId(): number {
        return this.GET_CATEGORY_ID!;
    }

    get getCatalogueId(): number {
        return this.GET_CATALOGUE_ID!;
    }

    get getCatalogue(): string {
        return this.GET_CATALOGUE!;
    }

    get actualCatalogue(): any {
        if (this.$route.query.catalogue_id) {
            return this.$route.query.catalogue_id;
        } else {
            return 0;
        }
    }

    async showCategory(category: Category) {
        await this.MODIFY_CATEGORY(category);
        await this.MODIFY_CATALOGUE({});
        if (this.$router.currentRoute.query.category_id !== this.getCategoryId!.toString())
            this.$router.push(`/products?category_id=${category.id}`);
    }

    async showCatalogue(catalogue: Catalogue) {
        await this.MODIFY_CATALOGUE(catalogue);
        this.changeRoute();
        this.filter.catalogueId = this.getCatalogueId;
        this.$emit('refreshProducts', this.filter);
    }

    searchAll(): void {
        this.model = [0, 0];
        this.filter.price = undefined;
        this.filter.rating = undefined;
        if (this.$router.currentRoute.fullPath !== '/products') this.$router.push(`/products`);
        this.$emit('refreshProducts', {});
    }

    getProductsByPrice(productPrice: number): void {
        if (productPrice !== undefined) this.filter.price = productPrice;
        else this.filter.price = undefined;
        if (this.$router.currentRoute.query.catalogue_id) {
            this.filter.catalogueId = this.getCatalogueId;
        }
        this.$emit('refreshProducts', this.filter);
    }

    getProductsByRating(productRating: number): void {
        if (productRating !== undefined) this.filter.rating = productRating;
        else this.filter.rating = undefined;
        if (this.$router.currentRoute.query.catalogue_id) {
            this.filter.catalogueId = this.getCatalogueId;
        }
        this.$emit('refreshProducts', this.filter);
    }

    setCatalogue(catalogue: Catalogue): void {
        this.MODIFY_CATALOGUE(catalogue);
        const data: ProductFilters = { catalogueId: this.getCatalogueId };
        this.changeRoute();
        this.$emit('refreshProducts', data);
    }

    changeRoute() {
        if (this.$router.currentRoute.query.catalogue_id !== this.getCatalogueId!.toString())
            this.$router.push(
                `/products?category_id=${this.getCategoryId}&catalogue_id=${this.getCatalogueId}`,
            );
    }

    get list(): any {
        return [
            {
                title: this.$t('CATEGORIES'),
                section: this.GET_CATEGORIES!,
            },
            {
                title: this.$t('PRICES'),
                types: [
                    {
                        type: this.$t('ALL') + '',
                    },
                    {
                        type: this.$t('UP_TO'),
                        price: 100,
                        currency: '$',
                    },
                    {
                        type: this.$t('UP_TO'),
                        price: 200,
                        currency: '$',
                    },
                    {
                        type: this.$t('UP_TO'),
                        price: 300,
                        currency: '$',
                    },
                    {
                        type: this.$t('UP_TO'),
                        price: 500,
                        currency: '$',
                    },
                ],
            },
            {
                title: this.$t('RATING'),
                rating: [
                    { type: this.$t('ALL') + '...' },
                    { value: 1 },
                    { value: 2 },
                    { value: 3 },
                    { value: 4 },
                    { value: 5 },
                ],
            },
        ];
    }

    async mounted() {
        await this.FETCH_CATEGORIES();
    }

    @layout.Getter(LayoutTypes.getters.GET_CATEGORY)
    private GET_CATEGORY?: string;

    @layout.Getter(LayoutTypes.getters.GET_CATEGORY_ID)
    private GET_CATEGORY_ID?: number;

    @layout.Getter(LayoutTypes.getters.GET_CATALOGUE)
    private GET_CATALOGUE?: string;

    @layout.Getter(LayoutTypes.getters.GET_CATALOGUE_ID)
    private GET_CATALOGUE_ID?: number;

    @catalogueModule.Getter(CatalogueMethods.getters.GET_CATALOGUES)
    GET_CATALOGUES!: CataloguesInterface;

    @categoryModule.Action(CategoriesMethods.actions.FETCH_CATEGORIES)
    private FETCH_CATEGORIES!: () => boolean;

    @categoryModule.Getter(CategoriesMethods.getters.GET_CATEGORIES)
    private GET_CATEGORIES?: Category[];
    @layout.Action(LayoutTypes.actions.MODIFY_CATALOGUE) MODIFY_CATALOGUE!: (catalogue: Catalogue) => void;
    @layout.Action(LayoutTypes.actions.MODIFY_CATEGORY) MODIFY_CATEGORY!: (category: Category) => void;
}
</script>

<style scoped>
.all {
    height: 100%;
}

.text-title-aside {
    color: #907f46;
    font-size: 16px;
}

.text-catalogues {
    font-size: 16px !important;
    cursor: pointer;
}

.text-catalogues:hover {
    color: #f09774 !important;
}

.iconos-aside {
    font-size: 20px !important;
}

.iconos-aside-litle {
    font-size: 12px !important;
}

.title-aside {
    font-size: 18px !important;
}

.text-price {
    cursor: pointer !important;
}

.subheader {
    font-size: 18px !important;
    color: #907f46;
    font-weight: 700;
    padding: 5px;
}

.text-price:hover,
.text-price:hover b {
    color: #f1cabb !important;
}

.link_selected {
    color: #907f46;
}
</style>
