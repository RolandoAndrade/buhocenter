<template>
    <div>
        <v-container class="mt-8">
            <h3 class="text-center">{{$t('CATEGORIES').toUpperCase()}} </h3>
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
                            <v-hover v-slot:default="{ hover }">
                                <v-card
                                        class="mx-auto"
                                        color="grey lighten-4"
                                        max-width="600"
                                >

                                    <v-hover
                                            v-slot:default="{ hover }"
                                            close-delay="200"
                                    >
                                        <v-card
                                                :elevation="hover ? 16 : 2"
                                                class="mx-auto"
                                                height="100"
                                                max-width="350"
                                        >
                                            <v-card-text class="font-weight-medium mt-12 text-center subtitle-1 pb-0">
                                                <v-icon style="text-decoration: none;" color="primary">{{card.icon}}</v-icon>
                                            </v-card-text>
                                            <v-card-title class="overline justify-center">
                                                {{$t(card.term)}}
                                            </v-card-title>
                                        </v-card>
                                    </v-hover>
                                </v-card>
                            </v-hover>
                        </template>
                    </a>
                </v-col>
            </v-row>
            <!--<v-row dense v-else>
                <v-col cols="12" lg="6" offset-lg="5" md="4" offset-md="4">
                    <v-progress-circular
                            :size="200"
                            :width="10"
                            color="primary"
                            indeterminate
                    ></v-progress-circular>
                </v-col>
            </v-row>-->
        </v-container>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from "vue-class-component";
    import {categoryModule, layout} from "@/store/namespaces";
    import { Watch } from "vue-property-decorator";
    import CategoriesMethods from '@/store/category-module/methods/category-methods'
    import {SET_CATALOGUE, SET_CATEGORY} from "@/store/layout/methods/layout.mutations";
    import {MODIFY_CATEGORY} from "@/store/layout/methods/layout.actions";

    @Component
    export default class Categories extends Vue {
        page: number = 1;
        productsDisplayed: number = 8;
        timeout: number = 5000;
        errorLoadingContent: boolean = false;

        @Watch('page')
        async changePage() {
            await this.fetchCategories();
        }

        closeSnackbar() {
            this.errorLoadingContent = false;
        }

        get getLength() {
            const length: number = this.GET_TOTAL_CATEGORIES - this.productsDisplayed + 1;

            if (length < 0) {
                return 1;
            }

            return length;
        }

        async fetchCategories() {
            //this.SET_CATEGORY_PHOTOS_NOT_LOADED(false);
            const fetched: boolean = await this.FETCH_CATEGORIES();
            /*if (!fetched) {
                this.errorLoadingContent = true;
            } else {
                await this.FETCH_CATEGORY_PHOTO_BY_NAME(this.GET_CATEGORIES);
            }*/
        }

        async mounted() {
            await this.fetchCategories();
        }

        setCategory(category){
            this.MODIFY_CATEGORY(category);
            this.$router.push(`/catalogues?category_id=${category.id}`)
        }

        @categoryModule.Action(CategoriesMethods.actions.FETCH_CATEGORIES) private FETCH_CATEGORIES;
        @categoryModule.Action(CategoriesMethods.actions.FETCH_CATEGORY_PHOTO_BY_NAME) private FETCH_CATEGORY_PHOTO_BY_NAME;
        @categoryModule.Action(CategoriesMethods.actions.SET_CATEGORY_PHOTOS_NOT_LOADED) private SET_CATEGORY_PHOTOS_NOT_LOADED;
        @categoryModule.Getter(CategoriesMethods.getters.GET_CATEGORIES) private GET_CATEGORIES;
        @categoryModule.Getter(CategoriesMethods.getters.GET_TOTAL_CATEGORIES) private GET_TOTAL_CATEGORIES;
        @categoryModule.Getter(CategoriesMethods.getters.GET_CATEGORIES_AND_PHOTOS_LOADED) private  GET_CATEGORIES_AND_PHOTOS_LOADED;

        @layout.Action(MODIFY_CATEGORY) private MODIFY_CATEGORY;

    }
</script>
