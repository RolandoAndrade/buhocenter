import { Module } from 'vuex';
import ProductsTypes from '@/store/products/methods/products.methods';
import productsHttpRepository from '@/modules/client/products/repositories/products.repository';
import servicesHttpRepository from '@/modules/client/services/repositories/services.repository';
import productsFirebaseRepository from '@/modules/client/products/repositories/products.firebase';
import servicesFirebaseRepository from '@/modules/client/services/repositories/services.firebase';
import { ITEM_TYPE } from '@/config/constants';
import { PRODUCT_EMPTY_STATE } from './products.state';
import { ProductStateInterface } from './interfaces/products.state.interface';
import {
    Product,
    ProductPhotoDto,
    dimensionDto,
    ProductCreate,
    ProductRatingCreate,
    Products,
    ProductFilters,
} from '@/modules/client/products/interfaces/products.interface';
import { Filter } from '@/utils/filter';

const products: Module<ProductStateInterface, any> = {
    namespaced: true,
    state: PRODUCT_EMPTY_STATE,
    getters: {
        [ProductsTypes.getters.GET_PRODUCTS](state): Product[] {
            return state.products;
        },
        [ProductsTypes.getters.GET_ALL_PRODUCTS](state): Product[] {
            return state.allProducts;
        },
        [ProductsTypes.getters.GET_PRODUCTS_AND_PHOTOS_LOADED](state): boolean {
            return state.productsAndPhotosLoaded;
        },
        [ProductsTypes.getters.GET_TOTAL_PRODUCTS](state): number {
            return state.totalProducts;
        },
        [ProductsTypes.getters.GET_ITEM_DETAIL](state): Product {
            return state.itemDetail;
        },
        [ProductsTypes.getters.GET_PRODUCTS_DAILY](state): Product[] {
            return state.productsDaily;
        },
        [ProductsTypes.getters.GET_PRODUCTS_DAILY_AND_PHOTOS_LOADED](state): boolean {
            return state.productsDailyAndPhotosLoaded;
        },
        [ProductsTypes.getters.GET_PRODUCT_INDEX_ID](state): number {
            return state.products[0].id!;
        },
    },
    mutations: {
        [ProductsTypes.mutations.SET_ITEM_DETAIL](state, item: Product): void {
            state.itemDetail = item;
        },
        [ProductsTypes.mutations.SET_PRODUCTS](state, products: Product[]): void {
            state.products = products;
        },
        [ProductsTypes.mutations.SET_ALL_PRODUCTS](state, products: Product[]): void {
            state.allProducts = products;
        },
        [ProductsTypes.mutations.SET_PRODUCT_AND_PHOTOS_LOADED](state, loaded: boolean): void {
            state.productsAndPhotosLoaded = loaded;
        },
        [ProductsTypes.mutations.SET_TOTAL_PRODUCTS](state, total: number): void {
            state.totalProducts = total;
        },
        [ProductsTypes.mutations.SET_PRODUCTS_DAILY](state, products: Product[]): void {
            state.productsDaily = products;
        },
        [ProductsTypes.mutations.SET_PRODUCT_DAILY_AND_PHOTOS_LOADED](state, loaded: boolean): void {
            state.productsDailyAndPhotosLoaded = loaded;
        },
    },
    actions: {
        async [ProductsTypes.actions.FETCH_PRODUCT_DETAIL]({ commit }, productId: number): Promise<boolean> {
            try {
                const itemDetail: Product = await productsHttpRepository.getProductById(productId);
                commit(ProductsTypes.mutations.SET_ITEM_DETAIL, itemDetail);
                return true;
            } catch (e) {
                return false;
            }
        },
        //eliminar
        async [ProductsTypes.actions.FETCH_SERVICE_DETAIL]({ commit }, productId: number): Promise<boolean> {
            try {
                const itemDetail = await servicesHttpRepository.getServiceById(productId);
                commit(ProductsTypes.mutations.SET_ITEM_DETAIL, itemDetail);
                return true;
            } catch (e) {
                return false;
            }
        },
        [ProductsTypes.actions.SET_PRODUCT_PHOTOS_NOT_LOADED]({ commit }, loaded: boolean): void {
            commit(ProductsTypes.mutations.SET_PRODUCT_AND_PHOTOS_LOADED, loaded);
        },
        async [ProductsTypes.actions.FETCH_PRODUCTS]({ commit }, data: ProductFilters): Promise<boolean> {
            try {
                const filter: Filter = new Filter(data);
                const products: Products = await productsHttpRepository.getProducts(filter);
                commit(ProductsTypes.mutations.SET_PRODUCTS, products.products);

                //if ((data = {})) commit(ProductsTypes.mutations.SET_ALL_PRODUCTS, products.products);
                commit(ProductsTypes.mutations.SET_TOTAL_PRODUCTS, products.productsNumber);

                return true;
            } catch (e) {
                return false;
            }
        },
        async [ProductsTypes.actions.FETCH_PRODUCT_ITEM_PHOTOS](
            { commit },
            { itemId, item },
        ): Promise<boolean> {
            try {
                for await (const element of item.productPhotos) {
                    element.imageUrl = await productsFirebaseRepository.getProductPhotoByName(
                        itemId,
                        element.content,
                    );
                }
                commit(ProductsTypes.mutations.SET_ITEM_DETAIL, item);
                return true;
            } catch (e) {
                return false;
            }
        },
        // eliminar
        async [ProductsTypes.actions.FETCH_SERVICE_ITEM_PHOTOS](
            { commit },
            { itemId, item },
        ): Promise<boolean> {
            try {
                for await (const element of item.photos) {
                    element.imageUrl = await servicesFirebaseRepository.getServicePhotoByName(
                        itemId,
                        element.content,
                    );
                }
                commit(ProductsTypes.mutations.SET_ITEM_DETAIL, item);
                return true;
            } catch (e) {
                return false;
            }
        },
        async [ProductsTypes.actions.FETCH_PRODUCT_PHOTO_BY_NAME](
            { commit },
            products: Product[],
        ): Promise<boolean> {
            try {
                for await (const element of products) {
                    element.type = ITEM_TYPE.PRODUCT;
                    const principalPhoto: string = element.productPhotos![0].content!;
                    const photo = await productsFirebaseRepository.getProductPhotoByName(
                        element.id!,
                        principalPhoto,
                    );
                    element.imageUrl! = photo;
                }
                commit(ProductsTypes.mutations.SET_PRODUCTS, products);
                commit(ProductsTypes.mutations.SET_PRODUCT_AND_PHOTOS_LOADED, true);
                return true;
            } catch (e) {
                return false;
            }
        },
        async [ProductsTypes.actions.UPDATE_PRODUCT]({ commit }, product: ProductCreate): Promise<boolean> {
            try {
                delete product.photosFiles;
                const productUpdated = await productsHttpRepository.updateProductData(product);
                return productUpdated;
            } catch (e) {
                return false;
            }
        },
        async [ProductsTypes.actions.FETCH_ALL_PRODUCTS]({ commit }): Promise<boolean> {
            try {
                const products: Products = await productsHttpRepository.getAllProducts();
                commit(ProductsTypes.mutations.SET_ALL_PRODUCTS, products);

                return true;
            } catch (e) {
                return false;
            }
        },
        async [ProductsTypes.actions.DELETE_PRODUCT]({ commit }, id): Promise<boolean> {
            try {
                await productsHttpRepository.deleteProducts(id);
                return true;
            } catch (e) {
                return false;
            }
        },
        async [ProductsTypes.actions.FETCH_PRODUCTS_DAILY]({ commit }): Promise<boolean> {
            try {
                // tslint:disable-next-line:no-shadowed-variable
                const products: Product[] = await productsHttpRepository.getProductsDailyRecommendation();
                commit(ProductsTypes.mutations.SET_PRODUCTS_DAILY, products);
                return true;
            } catch (e) {
                return false;
            }
        },
        async [ProductsTypes.actions.FETCH_PRODUCTS_DAILY_DETAIL_PHOTOS](
            { commit },
            products: Product[],
        ): Promise<boolean> {
            try {
                for (const product of products) {
                    product.productPhotos![0] = await productsFirebaseRepository.getProductPhotoByName(
                        product.id!,
                        product.productPhotos![0].content!,
                    );
                }
                commit(ProductsTypes.mutations.SET_PRODUCTS_DAILY, products);
                commit(ProductsTypes.mutations.SET_PRODUCT_DAILY_AND_PHOTOS_LOADED, true);
                return true;
            } catch (e) {
                return false;
            }
        },
        async [ProductsTypes.actions.CREATE_PRODUCT](
            { commit },
            product: ProductCreate,
        ): Promise<Product | boolean> {
            try {
                delete product.photosFiles;
                const response: Product = await productsHttpRepository.createProduct(product);
                return response;
            } catch (e) {
                return false;
            }
        },
        async [ProductsTypes.actions.FETCH_PRODUCT_IMAGE]({ commit }, imageAndProduct): Promise<boolean> {
            try {
                const photo = await productsFirebaseRepository.getProductPhotoByName(
                    imageAndProduct.id,
                    imageAndProduct.image,
                );
                return photo;
            } catch (e) {
                return false;
            }
        },
        async [ProductsTypes.actions.UPDATE_IMAGE]({ commit }, imageAndProduct): Promise<boolean> {
            try {
                await productsFirebaseRepository.updateImage(
                    imageAndProduct.oldFile,
                    imageAndProduct.newFile,
                    imageAndProduct.id,
                );
                return true;
            } catch (e) {
                return false;
            }
        },
        async [ProductsTypes.actions.UPLOAD_IMAGE]({ commit }, imageAndProduct): Promise<boolean> {
            try {
                await productsFirebaseRepository.uploadImage(imageAndProduct.image, imageAndProduct.id);
                return true;
            } catch (e) {
                return false;
            }
        },
        async [ProductsTypes.actions.SAVE_PRODUCT_PHOTOS](
            { commit },
            imageAndProduct: ProductPhotoDto,
        ): Promise<boolean> {
            try {
                imageAndProduct;
                await productsHttpRepository.uploadImage(imageAndProduct);
                return true;
            } catch (e) {
                return false;
            }
        },
        async [ProductsTypes.actions.SAVE_PRODUCT_DIMENSION](
            { commit },
            imageAndProduct: dimensionDto,
        ): Promise<boolean> {
            try {
                await productsHttpRepository.createDimension(imageAndProduct);
                return true;
            } catch (e) {
                return false;
            }
        },
        async [ProductsTypes.actions.SAVE_INVENTORY_QUANTITY]({ commit }, inventoryData): Promise<boolean> {
            try {
                await productsHttpRepository.saveInventary(inventoryData);
                return true;
            } catch (e) {
                return false;
            }
        },
        async [ProductsTypes.actions.UPDATE_INVENTORY_QUANTITY]({ commit }, inventoryData): Promise<boolean> {
            try {
                await productsHttpRepository.updateInventory(inventoryData);
                return true;
            } catch (e) {
                return false;
            }
        },
        async [ProductsTypes.actions.CREATE_PRODUCT_RATING](
            { commit },
            productRating: ProductRatingCreate,
        ): Promise<boolean> {
            try {
                await productsHttpRepository.createProductRating(productRating);
                return true;
            } catch (e) {
                return false;
            }
        },
    },
};

export default products;
