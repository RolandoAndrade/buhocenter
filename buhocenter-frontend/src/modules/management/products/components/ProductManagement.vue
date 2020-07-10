<template>
    <v-container>
        <v-btn text @click="showAllProducts">
            <v-icon class="mr-3"> mdi-keyboard-backspace </v-icon> {{ $t('BACK') }}
        </v-btn>
        <div class="mx-12">
            <v-form ref="form" v-model="isFormValid">
                <h2>
                    {{ $t('PRODUCT_DESCRIPTION') }}
                </h2>
                <v-divider color="gold"></v-divider>
                <v-row>
                    <v-col lg="12">
                        <v-textarea
                            v-model="product.name"
                            outlined
                            rows="2"
                            autofocus
                            :label="$t('NAME')"
                            :rules="[rules.required(), rules.fieldMaxLength(400)]"
                        ></v-textarea>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col lg="12">
                        <v-textarea
                            counter="65500"
                            outlined
                            rows="2"
                            :label="$t('DESCRIPTION')"
                            v-model="product.description"
                            :rules="[rules.required(), rules.fieldMaxLength(65500)]"
                        ></v-textarea>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-autocomplete
                            v-model="product.brand"
                            :items="brands"
                            item-value="id"
                            item-text="name"
                            :label="$t('BRAND')"
                            return-object
                            outlined
                            :rules="[rules.requiredDropdown(product.brand.id)]"
                        ></v-autocomplete>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col lg="4" v-for="(item, index) in [0, 1, 2]" :key="item.id">
                        <div class="d-flex justify-center">
                            <v-img
                                class="mb-4"
                                :src="product.photosFiles[index].url"
                                contain
                                max-height="150"
                                max-width="150"
                                v-if="product.photosFiles[index].url !== ''"
                            ></v-img>
                        </div>
                        <v-file-input
                            :loading="loadingPhotos"
                            show-size
                            @change="previewImage(index, $event)"
                            prepend-icon="mdi-camera"
                            counter
                            :clearable="canDeletePhotos(index)"
                            dense
                            outlined
                            :rules="[rules.requiredPhoto(index, product.productPhotos[0].content)]"
                            :label="$t('UPLOAD_IMAGE')"
                            accept="image/png, image/jpeg, image/jpg"
                        >
                        </v-file-input>
                    </v-col>
                </v-row>
                <h2>
                    {{ $t('PRODUCT_DIMENSIONS') }}
                </h2>
                <v-divider color="gold"></v-divider>
                <v-row>
                    <v-col :cols="responsive()">
                        <v-text-field
                            outlined
                            :label="$t('WEIGHT')"
                            type="number"
                            min="1"
                            v-model="product.productDimension.weight"
                            :rules="[rules.required(), rules.notNegative(product.productDimension.weight)]"
                            suffix="Gr"
                            clearable
                        ></v-text-field>
                    </v-col>
                    <v-col :cols="responsive()">
                        <v-text-field
                            outlined
                            :label="$t('LONG')"
                            type="number"
                            min="1"
                            v-model="product.productDimension.long"
                            :rules="[rules.required(), rules.notNegative(product.productDimension.long)]"
                            suffix="Cm"
                            clearable
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col :cols="responsive()">
                        <v-text-field
                            outlined
                            :label="$t('HEIGHT')"
                            suffix="Cm"
                            type="number"
                            min="1"
                            v-model="product.productDimension.height"
                            :rules="[rules.required(), rules.notNegative(product.productDimension.height)]"
                            clearable
                        ></v-text-field>
                    </v-col>
                    <v-col :cols="responsive()">
                        <v-text-field
                            outlined
                            :label="$t('WIDTH')"
                            suffix="Cm"
                            type="number"
                            min="1"
                            v-model="product.productDimension.width"
                            :rules="[rules.required(), rules.notNegative(product.productDimension.width)]"
                            clearable
                        ></v-text-field>
                    </v-col>
                </v-row>
                <h2>
                    {{ $t('PRODUCT_CATEGORIES') }}
                </h2>
                <v-divider color="gold"></v-divider>
                <v-row>
                    <v-col :cols="responsive()">
                        <v-autocomplete
                            outlined
                            v-model="category"
                            :items="categoryItems"
                            :disabled="canSelectCatalogues()"
                            item-text="name"
                            :label="$t('CATEGORIES')"
                            @change="filterCatalogues()"
                        ></v-autocomplete>
                    </v-col>
                    <v-col :cols="responsive()">
                        <v-autocomplete
                            outlined
                            v-model="product.productCatalogues"
                            :items="catalogues"
                            :disabled="canSelectCatalogues()"
                            item-value="id"
                            item-text="name"
                            :label="$t('CATALOGUES')"
                            multiple
                            return-object
                            :rules="[rules.notEmpty()]"
                        ></v-autocomplete>
                    </v-col>
                </v-row>
                <h2>
                    {{ $t('PROVIDER') }}
                </h2>
                <v-divider color="gold"></v-divider>
                <v-row>
                    <v-col :cols="responsive()">
                        <v-autocomplete
                            outlined
                            v-model="product.provider"
                            :items="providers"
                            item-value="id"
                            item-text="name"
                            :label="$t('PROVIDER')"
                            return-object
                            :rules="[rules.requiredDropdown(product.provider.id)]"
                        ></v-autocomplete>
                    </v-col>
                    <v-col :cols="responsive()">
                        <v-text-field
                            outlined
                            v-model="product.productInventory.availableQuantity"
                            :label="$t('IN_STOCK')"
                            type="number"
                            min="1"
                            :rules="[
                                rules.required(),
                                rules.notNegative(product.productInventory.availableQuantity),
                            ]"
                        ></v-text-field>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col :cols="responsive()">
                        <v-text-field
                            outlined
                            v-model="product.price"
                            :label="$t('PRICE')"
                            type="number"
                            suffix="$"
                            min="1"
                            :rules="[rules.required(), rules.notNegative(product.price)]"
                        ></v-text-field>
                    </v-col>
                    <v-col :cols="responsive()">
                        <v-text-field
                            outlined
                            v-model="product.productInventory.minimumAvailableQuantity"
                            :label="$t('MIN_QUANTITY')"
                            type="number"
                            min="1"
                            :rules="[
                                rules.required(),
                                rules.notNegative(product.productInventory.minimumAvailableQuantity),
                            ]"
                        ></v-text-field>
                    </v-col>
                </v-row>
                <h2>
                    {{ $t('OTHER_PRODUCT_DETAILS') }}
                </h2>
                <v-divider color="gold"></v-divider>
                <v-row class="mb-10">
                    <v-col>
                        <v-autocomplete
                            outlined
                            v-model="product.offer"
                            :items="offers"
                            item-value="id"
                            item-text="name"
                            :label="$t('OFFERS')"
                            return-object
                        ></v-autocomplete>
                        <v-autocomplete
                            outlined
                            v-model="product.status"
                            :items="statuses"
                            item-value="id"
                            item-text="name"
                            :label="$t('STATUS')"
                            return-object
                            clearable
                            :rules="[rules.required()]"
                        ></v-autocomplete>
                    </v-col>
                    <v-divider vertical inset> </v-divider>
                    <v-col>
                        <v-switch
                            v-model="product.canAccumulatePoints"
                            :label="$t('CAN_ACCUMULATE_POINTS')"
                            inset
                            color="primary"
                        ></v-switch>
                        <v-switch
                            v-model="product.fragile"
                            :label="$t('IS_FRAGILE')"
                            inset
                            color="primary"
                        ></v-switch>
                    </v-col>
                </v-row>
            </v-form>
            <v-row class="d-flex justify-center my-2" v-if="item != null">
                <v-btn outlined color="primary" @click="updateProduct()">{{ $t('SAVE') }}</v-btn>
            </v-row>
            <v-row class="d-flex justify-center my-2" v-else>
                <v-btn outlined color="primary" @click="createProduct()">{{ $t('CREATE_PRODUCT') }} </v-btn>
            </v-row>
        </div>
        <v-snackbar class="mt-12" v-model="someFieldsAreEmpty" top color="error">
            {{ $t('CHECK_FIELDS') }}
            <v-btn color="white" text @click="someFieldsAreEmpty = false">Cerrar</v-btn>
        </v-snackbar>
    </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { Prop, Watch } from 'vue-property-decorator';
import Component from 'vue-class-component';
import { brands, providers, categoryModule, products, catalogueModule, offers } from '@/store/namespaces';
import ProviderTypes from '@/store/providers/methods/providers.methods';

import ProductTypes from '@/store/products/methods/products.methods';
import CategoriesTypes from '@/store/categories/methods/categories.methods';
import CatalogueTypes from '@/store/catalogue/methods/catalogue.methods';
import OffersTypes from '@/store/offers/methods/offers.methods';
import BrandTypes from '@/store/brands/methods/brands.methods';
import { Product, photosFilesInterface } from '../../../client/products/interfaces/products.interface';
import { Provider } from '../../../client/provider/interfaces/provider.interface';
import { Offer } from '@/modules/management/promotions/interfaces/offer.interface';
import rules from '@/utils/rules';

@Component
export default class ProductManagement extends Vue {
    @Prop() item!: any;

    productCreated: boolean = false;
    productCreatedError: boolean = false;
    someFieldsAreEmpty: boolean = false;
    productUpdated: boolean = false;
    showPics = this.item == null ? false : true;
    rules: any = rules;
    $refs!: {
        form: any;
    };
    category = this.item ? this.item.productCatalogues[0].catalogue.category.name : '';
    catalogues = [];
    statuses = [
        { id: 1, name: 'Active' },
        { id: 2, name: 'Inactive' },
    ];
    isFormValid: boolean = false;
    loadingPhotos = true;
    productId = this.item ? this.item.id : '';

    photosFiles: photosFilesInterface[] = [
        { url: '', file: undefined },
        { url: '', file: undefined },
        { url: '', file: undefined },
    ];

    product = {
        name: this.item ? this.item.name : '',
        description: this.item ? this.item.description : '',
        canAccumulatePoints: this.item ? this.item.canAccumulatePoints : false,
        price: this.item ? this.item.price : '',
        fragile: this.item ? this.item.fragile : false,
        status: {
            id: this.item ? this.item.status.id : this.statuses[0].id,
            name: this.item ? this.item.status.name : this.statuses[0].name,
        },
        brand: {
            id: this.item ? this.item.brand.id : '',
            name: this.item ? this.item.brand.name : '',
        },
        provider: {
            id: this.item ? this.item.provider.id : '',
            name: this.item ? this.item.provider.name : '',
        },
        productDimension: {
            id: this.item ? this.item.productDimension.id : '',
            height: this.item ? this.item.productDimension.height : '',
            long: this.item ? this.item.productDimension.long : '',
            width: this.item ? this.item.productDimension.width : '',
            weight: this.item ? this.item.productDimension.weight : '',
        },
        productInventory: {
            id: this.item ? this.item.productInventory.id : '',
            minimumAvailableQuantity: this.item ? this.item.productInventory.minimumAvailableQuantity : '',
            availableQuantity: this.item ? this.item.productInventory.availableQuantity : '',
        },
        productCatalogues: this.item ? this.getCatalogues() : '',
        productPhotos: this.item ? this.setOldImages() : [{ content: '' }, { content: '' }, { content: '' }],
        offer: {
            id: this.item ? (this.item.offer != null ? this.item.offer.id : '') : '',
            name: this.item
                ? this.item.offer != null
                    ? this.item.offer.percentage + '% ' + this.item.offer.name
                    : ''
                : '',
        },
        photosFiles: this.photosFiles,
    };

    canDeletePhotos(index) {
        return this.item && this.item.productPhotos[index] ? false : true;
    }

    canSelectCatalogues() {
        return this.item ? true : false;
    }

    async mounted(): Promise<void> {
        await this.FETCH_CATEGORIES();
        await this.FETCH_CATALOGUES();
        await this.FETCH_PROVIDERS();
        await this.FETCH_OFFERS({ start: 0, limit: 100 });
        await this.FETCH_BRANDS();
        this.setCataloguesIfUpdateProduct();
        await this.prewiewOldImagesIfUpdate();
    }

    setCataloguesIfUpdateProduct(): void {
        const catalogues: any = [];
        if (this.item) {
            this.item.productCatalogues.forEach((el) => {
                catalogues.push({ name: el.catalogue.name, id: el.catalogue.id });
            });
            this.catalogues = catalogues;
        }
    }

    responsive(): number {
        const { xs, sm } = this.$vuetify.breakpoint;
        return xs || sm ? 12 : 6;
    }

    showAllProducts(): void {
        this.$emit('showAllProducts', true);
    }

    showSuccessCreate(): void {
        this.$emit('showSuccessCreate', true);
    }

    showSuccessUpdate(): void {
        this.$emit('showSuccessUpdate', true);
    }

    showError(): void {
        this.$emit('showError', true);
    }

    setOldImages(): any {
        var images: any = [];
        this.item.productPhotos.forEach((el) => {
            images.push({ content: el.content, id: el.id });
        });
        const numberOfImages = images.length;
        if (numberOfImages == 2) images.push({ content: '' });
        if (numberOfImages == 1) images.push({ content: '' }, { content: '' });

        return images;
    }

    getCatalogues(): any {
        let catalogues: any = [];
        this.item.productCatalogues.map((el) => {
            catalogues.push({ name: el.catalogue.name, id: el.catalogue.id, term: el.catalogue.term });
        });
        this.category = this.item.productCatalogues[0].catalogue.category.name;
        return catalogues;
    }

    filterCatalogues(): any {
        this.product.productCatalogues = '';
        const catalogues: any = [];
        this.GET_CATEGORIES.map((i) => {
            if (i.name === this.category) {
                i.catalogues.map((el) => {
                    catalogues.push({ id: el.id, name: el.name, term: el.term });
                });
            }
        });
        this.catalogues = catalogues;
    }

    roundValues(): void {
        this.product.price = Math.round(this.product.price * 100) / 100;
        this.product.productDimension.long = Math.round(this.product.productDimension.long * 100) / 100;
        this.product.productDimension.height = Math.round(this.product.productDimension.height * 100) / 100;
        this.product.productDimension.width = Math.round(this.product.productDimension.width * 100) / 100;
        this.product.productDimension.weight = Math.round(this.product.productDimension.weight * 100) / 100;

        this.product.productInventory.minimumAvailableQuantity = Math.round(
            this.product.productInventory.minimumAvailableQuantity,
        );
        this.product.productInventory.availableQuantity = Math.round(
            this.product.productInventory.availableQuantity,
        );
    }

    reformatFields(): void {
        let catalogue: any = [];
        let photosLoaded: boolean = false;
        let photos: any = [];
        let ids: number[] = [];

        this.roundValues();

        if (this.item) {
            this.item.productCatalogues.forEach((el) => {
                ids.push(el.id);
            });
        }

        this.product.productCatalogues.forEach((el, i) => {
            catalogue.push({ catalogue: { id: el.id }, id: this.item ? ids[i] : el.id });
        });
        this.product.productCatalogues = catalogue;

        this.product.productPhotos.forEach((el) => {
            if (el.content != '') {
                photosLoaded = true;
                photos.push({ content: el.content, id: el.id });
            }
        });

        if (this.product.offer && this.product.offer.id == '') delete this.product.offer;

        if (!photosLoaded) delete this.product.productPhotos;
        else this.product.productPhotos = photos;
    }

    previewImage(index: number, event: any): void {
        if (event) {
            const file: any = event || event.dataTransfer.files;
            this.product.photosFiles[index].file = file;
            this.product.productPhotos[index].content = event.name;
            this.createImg(file, index);
        } else {
            this.product.photosFiles[index].file = undefined;
            this.product.photosFiles[index].url = '';
            this.product.productPhotos[index].content = '';
        }
    }

    createImg(file: any, image: number): void {
        const reader = new FileReader();

        reader.onload = (e: any) => {
            this.product.photosFiles[image].url = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    async prewiewOldImagesIfUpdate(): Promise<void> {
        if (this.item) {
            await this.product.productPhotos.forEach(async (el, index) => {
                if (el.content != '') {
                    const url = await this.FETCH_PRODUCT_IMAGE({ id: this.productId, image: el.content });
                    if (url) {
                        this.product.photosFiles[index].url = url;
                    }
                }
            });
        }
        this.loadingPhotos = false;
    }

    async createProduct(): Promise<void> {
        if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
            this.reformatFields();
            const product = await this.CREATE_PRODUCT(this.cleanProductDataCreate());
            if (product) {
                await this.uploadPhotosToFirebase(product.id);
                this.showSuccessCreate();
                this.showAllProducts();
            } else this.showError();
        } else this.someFieldsAreEmpty = true;
    }

    cleanProductDataUpdate(): any {
        let product = { ...this.product };
        delete product.status.name;
        delete product.brand.name;
        delete product.provider.name;
        if (product.offer) delete product.offer.name;
        return product;
    }

    cleanProductDataCreate(): any {
        const product = { ...this.product };
        if (product.productDimension.id != undefined) delete product.productDimension.id;
        if (product.productInventory.id != undefined) delete product.productInventory.id;
        delete product.status.name;
        delete product.brand.name;
        delete product.provider.name;
        product.productCatalogues.forEach((el) => {
            if (el.id != undefined) delete el.id;
        });
        product.productPhotos.forEach((el) => {
            delete el.id;
        });
        return product;
    }

    async updateProduct(): Promise<void> {
        if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
            this.reformatFields();
            this.product['id'] = this.item.id;
            const product = await this.UPDATE_PRODUCT(this.cleanProductDataUpdate());
            if (product) {
                await this.updatePhotosToFirebase();
                this.showSuccessUpdate();
                this.showAllProducts();
            } else this.showError();
        } else this.someFieldsAreEmpty = true;
    }

    async updatePhotosToFirebase(): Promise<void> {
        var changedPhotos: any = [];
        this.item.productPhotos.forEach((el, index) => {
            if (this.product.photosFiles[index].file) {
                if (el.content != this.product.photosFiles[index].file.name) {
                    changedPhotos.push({
                        oldFile: el.content,
                        newFile: this.product.photosFiles[index].file,
                    });
                }
            }
        });
        changedPhotos.forEach(async (el) => {
            await this.UPDATE_IMAGE({ oldFile: el.oldFile, newFile: el.newFile, id: this.productId });
        });

        this.product.productPhotos.forEach(async (el, index) => {
            if (el.content != '' && el.id == undefined)
                await this.UPLOAD_IMAGE({ image: this.product.photosFiles[index].file, id: this.item.id });
        });
    }

    async uploadPhotosToFirebase(productId: number): Promise<void> {
        this.product.photosFiles.forEach(async (el) => {
            await this.UPLOAD_IMAGE({ image: el.file, id: productId });
        });
    }

    @products.Action(ProductTypes.actions.UPLOAD_IMAGE) private UPLOAD_IMAGE;
    @products.Action(ProductTypes.actions.UPDATE_IMAGE) private UPDATE_IMAGE;
    @products.Action(ProductTypes.actions.FETCH_PRODUCT_IMAGE) private FETCH_PRODUCT_IMAGE;

    @products.Action(ProductTypes.actions.CREATE_PRODUCT)
    private CREATE_PRODUCT;

    @products.Action(ProductTypes.actions.UPDATE_PRODUCT)
    private UPDATE_PRODUCT;

    @brands.Action(BrandTypes.actions.FETCH_BRANDS) private FETCH_BRANDS;
    @brands.Getter(BrandTypes.getters.GET_BRANDS) private GET_BRANDS;

    @providers.Action(ProviderTypes.actions.FETCH_PROVIDERS) private FETCH_PROVIDERS;
    @providers.Getter(ProviderTypes.getters.GET_PROVIDERS) private GET_PROVIDERS;

    @categoryModule.Getter(CategoriesTypes.getters.GET_CATEGORIES) private GET_CATEGORIES;
    @categoryModule.Action(CategoriesTypes.actions.FETCH_CATEGORIES) private FETCH_CATEGORIES;

    @catalogueModule.Action(CatalogueTypes.actions.FETCH_ALL_CATALOGUES) private FETCH_CATALOGUES;
    @catalogueModule.Getter(CatalogueTypes.getters.GET_CATALOGUES) private GET_CATALOGUES;

    @offers.Action(OffersTypes.actions.FETCH_OFFERS) private FETCH_OFFERS;
    @offers.Getter(OffersTypes.getters.GET_OFFERS) private GET_OFFERS;

    get categoryItems(): any {
        return this.GET_CATEGORIES.map((i) => i.name);
    }

    get catalogueItems(): any {
        return this.GET_CATALOGUES.map((i) => i.name);
    }

    get providers(): any {
        const providers: any = [];
        this.GET_PROVIDERS.map((i) => {
            providers.push({ id: i.id, name: i.name });
        });
        return providers;
    }

    get offers(): any {
        const offers: any = [];
        this.GET_OFFERS.map((i) => {
            offers.push({ id: i.id, name: i.percentage + '% ' + i.name });
        });
        return offers;
    }

    get brands(): any {
        const brands: any = [];
        this.GET_BRANDS.map((i) => {
            brands.push({ id: i.id, name: i.name });
        });
        return brands;
    }
}
</script>
