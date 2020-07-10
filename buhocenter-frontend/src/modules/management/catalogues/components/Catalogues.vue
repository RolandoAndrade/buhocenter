<template>
    <v-container>
        <v-row>
            <v-col class="d-flex justify-center">
                <h2>{{ $t('CATEGORIES') }}</h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-card style="width: 80%; margin: 0 auto;">
                    <v-card-title>
                        <v-icon large color="primary" class="mr-6">{{ currentCategory.icon }}</v-icon>
                        <v-select
                            style="width: 50%;"
                            justify="center"
                            v-model="currentCategoryId"
                            append-icon="mdi-chevron-down"
                            label="Select a category"
                            :placeholder="$t(allCategories[0].term)"
                            single-line
                            hide-details
                            :items="allCategories"
                            item-text="name"
                            item-value="id"
                            item-color="primary"
                        ></v-select>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" class="mx-3 mt-4" @click="modalCreate = true">{{
                            $t('CREATE_CATALOGUE')
                        }}</v-btn>
                    </v-card-title>
                </v-card>
                <v-row>
                    <v-col class="mx-12">
                        <h3 class="mx-12">{{ $t('CATALOGUES') }}</h3>
                        <v-divider class="mx-12"></v-divider>
                    </v-col>
                </v-row>
                <div style="margin-top: 30px;" v-if="currentCategory.catalogues.length > 0">
                    <div v-for="catalogue in getVisibleCatelogues" :key="catalogue.id">
                        <v-card class="primary--text" style="padding: 10px; margin: 10px;">
                            <v-row class="d-flex align-start justify-center my-n6">
                                <v-col class="align-start">
                                    <p>{{ $t('NAME') }}</p>
                                    <p class="black--text mt-n2">{{ catalogue.name }}</p>
                                </v-col>
                                <v-col>
                                    <p>{{ $t('DESCRIPTION') }}</p>
                                    <p class="black--text mt-n2">
                                        {{ catalogue.description }}
                                    </p>
                                </v-col>
                                <v-col>
                                    <p>{{ $t('TERM') }}</p>
                                    <p class="black--text mt-n2">
                                        {{ catalogue.term }}
                                    </p>
                                </v-col>
                                <v-col>
                                    <p>Status</p>
                                    <p class="black--text mt-n2">
                                        {{ catalogue.status.name }}
                                    </p>
                                </v-col>
                                <v-col>
                                    <p class="black--text mt-8">
                                        <v-btn
                                            v-if="catalogue.status.id === 1"
                                            small
                                            outlined
                                            color="error"
                                            class="primary--text overline"
                                            @click="deleteCatalogue(catalogue.id)"
                                        >
                                            <v-icon small class="mr-2"> mdi-delete-outline</v-icon>
                                            INACTIVATE
                                        </v-btn>
                                        <v-btn
                                            v-else
                                            small
                                            outlined
                                            color="success"
                                            class="primary--text overline"
                                            @click="activateCatalogue(catalogue.id)"
                                        >
                                            <v-icon small class="mr-2"> mdi-check</v-icon>
                                            ACTIVATE
                                        </v-btn>
                                    </p>
                                </v-col>
                            </v-row>
                        </v-card>
                        <v-snackbar v-model="addSuccess" top color="success" class="mt-12">
                            {{ $t('CATALOGUE_SUCCES_DELETED') }}
                            <v-btn color="white" text @click="addSuccess = false">{{ $t('CLOSE') }}</v-btn>
                        </v-snackbar>
                        <v-snackbar v-model="addError" top color="error" class="mt-12">
                            {{ $t('CATALOGUE_FAILED_DELETED') }}
                            <v-btn color="white" text @click="addError = false">{{ $t('CLOSE') }}</v-btn>
                        </v-snackbar>
                    </div>
                    <v-pagination
                        v-model="page"
                        :length="totalPages"
                        class="mt-12"
                        v-if="showPagination"
                    ></v-pagination>
                </div>
                <div v-else class="empty-state">
                    No catalogues in this category
                </div>
            </v-col>
            <v-dialog v-model="modalCreate" max-width="800px"
                ><!--persistent>-->
                <v-card>
                    <v-card-title>
                        <v-icon large color="primary" class="mr-4">mdi-shape-outline</v-icon>
                        <span class="headline"
                            >{{ $t('CREATE_CATALOGUE_FOR') }} {{ $t(currentCategory.term) }}</span
                        >
                    </v-card-title>
                    <v-divider></v-divider>
                    <div class="ma-4">
                        <v-row>
                            <v-col>
                                <v-text-field
                                    label="Name your catalogue"
                                    v-model="catalogueName"
                                    class="mr-2"
                                ></v-text-field>
                            </v-col>
                            <v-col>
                                <v-text-field
                                    label="Give it a term"
                                    v-model="catalogueTerm"
                                    class="ml-2"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="8">
                                <v-textarea
                                    class="mt-6"
                                    outlined
                                    name="input-7-4"
                                    label="Give your catalogue a description"
                                    v-model="catalogueDescription"
                                ></v-textarea>
                            </v-col>
                            <v-col cols="4">
                                <v-radio-group v-model="catalogueStatus" row>
                                    <v-radio label="Active" :value="1"></v-radio>
                                    <v-radio label="Inactive" :value="2"></v-radio>
                                </v-radio-group>
                            </v-col>
                        </v-row>
                    </div>
                    <v-divider></v-divider>
                    <v-row>
                        <v-spacer></v-spacer>
                        <v-btn
                            :disabled="!validateForm"
                            color="primary"
                            class="mx-3 mt-4 mb-4 mr-8"
                            @click="createCatalogue()"
                            >{{ $t('CREATE_CATALOGUE') }}</v-btn
                        >
                    </v-row>
                </v-card>
            </v-dialog>
        </v-row>

        <v-snackbar v-model="addError2" top color="error" class="mt-12">
            {{ message }}
            <v-btn color="white" text @click="addError2 = false">{{ $t('CLOSE') }}</v-btn>
        </v-snackbar>
        <v-snackbar v-model="addSuccess2" top color="success" class="mt-12">
            Your catalogue has been successfully created!
            <v-btn color="white" text @click="addSuccess2 = false">{{ $t('CLOSE') }}</v-btn>
        </v-snackbar>
    </v-container>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { catalogueModule, categoryModule } from '@/store/namespaces';
import CatalogueMethods from '@/store/catalogue/methods/catalogue.methods';
import CategoriesMethods from '@/store/categories/methods/categories.methods';
import { Catalogues as CataloguesInterface } from '@/modules/client/catalogues/interfaces/catalogues.interface';
import { Catalogue } from '@/modules/client/catalogues/interfaces/catalogues.interface';
import { Category } from '@/modules/client/categories/interfaces/categories.interface';
import CatalogueCreate from './CatalogueCreate.vue';
import { CatalogueCreateI } from './interfaces/catalogue.create';

@Component
export default class DashboardCatalogues extends Vue {
    addSuccess: boolean = false;
    addError: boolean = false;
    addError2: boolean = false;
    addSuccess2: boolean = false;
    currentCategoryId = 1;
    modalCreate = false;
    catalogueName = '';
    catalogueTerm = '';
    catalogueDescription = '';
    catalogueStatus = 1;
    message = '';
    page: number = 1;
    start: number = 0;
    limit: number = 5;

    get currentCategory(): Category {
        return this.GET_CATEGORIES!.find((el) => el.id === this.currentCategoryId)!;
    }

    get validateForm(): boolean {
        if (this.catalogueDescription !== '' && this.catalogueName !== '' && this.catalogueTerm !== '') {
            return true;
        } else {
            return false;
        }
    }

    async mounted() {
        await this.FETCH_ALL_CATEGORIES();
        this.currentCategoryId = this.GET_CATEGORIES![0].id!;
    }

    get allCategories(): Category[] {
        var categories: Category[] = this.GET_CATEGORIES!;
        return categories;
    }

    async deleteCatalogue(id: number) {
        const deleted = await this.DELETE_CATALOGUE(id);
        if (!deleted) this.addError = true;
        await this.FETCH_ALL_CATEGORIES();
        if (this.currentCategory.catalogues!.length === 1)
            this.currentCategoryId = this.GET_CATEGORIES![0].id!;
    }

    async activateCatalogue(catalogueId: number) {
        const catalogue: CatalogueCreateI = {
            id: catalogueId,
            category: { id: this.currentCategoryId },
            status: { id: this.catalogueStatus },
        };
        this.updateCatalogue(catalogue, 'There was an error activating your catalogue');
    }

    async createCatalogue() {
        const catalogue: CatalogueCreateI = {
            name: this.catalogueName,
            description: this.catalogueDescription,
            term: this.catalogueTerm,
            category: { id: this.currentCategoryId },
            status: { id: this.catalogueStatus },
        };
        this.updateCatalogue(catalogue, 'There was an error creating your catalogue');
    }

    async updateCatalogue(catalogue: CatalogueCreateI, error: string) {
        if (!(await this.CREATE_CATALOGUE(catalogue))) this.addError2 = true;
        else if (catalogue.name) this.addSuccess2 = true;
        this.modalCreate = false;
        this.message = error;
        await this.FETCH_ALL_CATEGORIES();
    }

    get getVisibleCatelogues(): Catalogue[] {
        return this.currentCategory.catalogues!.slice(this.start, this.limit + this.start);
    }

    @Watch('page')
    setPagination(): void {
        this.start = (this.page - 1) * this.limit;
    }

    get showPagination(): boolean {
        return this.currentCategory.catalogues!.length > 0 ? true : false;
    }

    get totalPages(): number {
        const pages = Math.round(this.currentCategory.catalogues!.length / this.limit);
        if (this.currentCategory.catalogues!.length / this.limit > pages) {
            return pages + 1;
        } else {
            return pages;
        }
    }

    @categoryModule.Getter(CategoriesMethods.getters.GET_CATEGORIES)
    private GET_CATEGORIES?: Category[];
    @categoryModule.Action(CategoriesMethods.actions.FETCH_ALL_CATEGORIES)
    private FETCH_ALL_CATEGORIES!: () => boolean;

    @catalogueModule.Action(CatalogueMethods.actions.DELETE_CATALOGUE)
    private DELETE_CATALOGUE!: (id: number) => boolean;
    @catalogueModule.Action(CatalogueMethods.actions.FETCH_CATALOGUES)
    private FETCH_CATALOGUES!: (id: number) => boolean;
    @catalogueModule.Action(CatalogueMethods.actions.CREATE_CATALOGUE)
    private CREATE_CATALOGUE!: (catalogue: CatalogueCreateI) => boolean;
}
</script>
<style lang="scss">
.container-page {
    position: relative;
    width: 100%;
    padding: 0;
}
.v-image__image--contain {
    background-position-y: 38% !important;
}
.empty-state {
    margin: 0 auto;
    text-align: center;
    color: rgb(133, 133, 133);
    font-size: 25px;
}
@media only screen and (max-width: 600px) {
    .v-window__prev,
    .v-window__next {
        top: calc(40% - 20px) !important;
    }
}
</style>
