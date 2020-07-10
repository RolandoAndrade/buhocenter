<template>
    <div>
        <v-container class="mt-8">
            <h2 class="text-center">{{ $t('CATEGORIES').toUpperCase() }}</h2>
            <v-row dense>
                <v-col
                    v-for="card in GET_CATEGORIES"
                    :key="card.id"
                    :cols="4"
                    lg="2"
                    md="3"
                    sm="4"
                    xs="4"
                    class="mb-2"
                >
                    <a href="#" @click="setCategory(card)" style="text-decoration: none;">
                        <template>
                            <!-- VERIFICAR 2 -->
                            <!-- eslint-disable-next-line vue/no-unused-vars -->
                            <v-hover>
                                <v-card class="mx-auto" color="grey lighten-4" max-width="600">
                                    <v-hover v-slot:default="{ hover }" close-delay="200">
                                        <v-card
                                            :elevation="hover ? 16 : 2"
                                            class="mx-auto"
                                            height="120"
                                            max-width="350"
                                        >
                                            <v-card-text
                                                class="font-weight-medium mt-12 text-center subtitle-1 pb-0"
                                            >
                                                <v-icon style="text-decoration: none;" color="primary">{{
                                                    card.icon
                                                }}</v-icon>
                                            </v-card-text>
                                            <v-card-title class="overline justify-center">
                                                {{ $t(card.term) }}
                                            </v-card-title>
                                        </v-card>
                                    </v-hover>
                                </v-card>
                            </v-hover>
                        </template>
                    </a>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { categoryModule, layout } from '@/store/namespaces';
import { Watch } from 'vue-property-decorator';
import CategoriesMethods from '@/store/categories/methods/categories.methods';
import LayoutTypes from '@/store/layout/methods/layout.methods';
import { Category } from '../interfaces/categories.interface';

@Component
export default class Categories extends Vue {
    page = 1;
    productsDisplayed = 8;
    timeout = 5000;
    errorLoadingContent = false;

    @Watch('page')
    async changePage() {
        await this.fetchCategories();
    }

    closeSnackbar(): void {
        this.errorLoadingContent = false;
    }

    get getLength(): number {
        const length: number = this.GET_TOTAL_CATEGORIES! - this.productsDisplayed + 1;

        if (length < 0) {
            return 1;
        }

        return length;
    }

    async fetchCategories() {
        await this.FETCH_CATEGORIES();
    }

    async mounted() {
        await this.fetchCategories();
    }

    setCategory(category: Category): void {
        this.MODIFY_CATEGORY(category);
        this.$router.push(`/catalogues?category_id=${category.id}`);
    }

    @categoryModule.Action(CategoriesMethods.actions.FETCH_CATEGORIES)
    private FETCH_CATEGORIES!: () => boolean;
    @categoryModule.Action(CategoriesMethods.actions.SET_CATEGORY_PHOTOS_NOT_LOADED)
    private SET_CATEGORY_PHOTOS_NOT_LOADED!: (loaded: boolean) => void;

    @categoryModule.Getter(CategoriesMethods.getters.GET_CATEGORIES)
    private GET_CATEGORIES?: Category[];
    @categoryModule.Getter(CategoriesMethods.getters.GET_TOTAL_CATEGORIES)
    private GET_TOTAL_CATEGORIES?: number;
    @categoryModule.Getter(CategoriesMethods.getters.GET_CATEGORIES_AND_PHOTOS_LOADED)
    private GET_CATEGORIES_AND_PHOTOS_LOADED?: boolean;

    @layout.Action(LayoutTypes.actions.MODIFY_CATEGORY)
    private MODIFY_CATEGORY!: (category: Category) => void;
}
</script>
