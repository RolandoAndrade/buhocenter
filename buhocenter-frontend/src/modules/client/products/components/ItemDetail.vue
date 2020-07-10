<template>
    <v-container class="mt-5" style="max-width: none !important; background: #ffffff;">
        <v-row>
            <v-col cols="12" lg="9" md="8" sm="12">
                <v-container fluid class="mt-5" style="max-width: none !important; width: 100%;">
                    <v-row v-if="itemDetailLoaded" class="pa-0">
                        <v-col cols="12" lg="1" md="1" sm="2" class="justify-center ma-0">
                            <div v-for="photo in GET_ITEM_DETAIL.productPhotos" :key="photo.imageUrl">
                                <v-img
                                    class="justify-center my-2 pa-0"
                                    alt="Image"
                                    contain
                                    :height="$vuetify.breakpoint.mdAndUp ? '50' : '50'"
                                    :width="$vuetify.breakpoint.mdAndUp ? '50' : '50'"
                                    :src="photo.imageUrl"
                                    @click="changePhotoSelected(photo.imageUrl)"
                                    :style="
                                        imageSelected === photo.imageUrl ? 'border: 1px solid #c4c3c0;' : ''
                                    "
                                ></v-img>
                            </div>
                        </v-col>
                        <v-col col="12" lg="6" md="5" sm="8" class="mx-auto d-flex justify-center">
                            <v-img
                                class="justify-center image-product"
                                alt="Image"
                                contain
                                :src="imageSelected"
                            ></v-img>
                        </v-col>
                        <v-col cols="12" sm="12" class="d-xs-flex d-sm-flex d-md-none d-lg-none">
                            <v-row>
                                <v-row fill-width class="pa-1 mx-auto">
                                    <v-select
                                        small
                                        color="white"
                                        v-model="quantity"
                                        :items="getProductStock"
                                        label="Qty"
                                        persistent-hint
                                    ></v-select>
                                </v-row>
                                <v-row fill-width class="pa-1 mx-auto">
                                    <v-btn
                                        @click="addItemToCart(quantity)"
                                        block
                                        outlined
                                        color="primary"
                                        style="height: 50px;"
                                    >
                                        <v-icon left class="d-flex align-center">mdi-cart-outline</v-icon>
                                        <p class="ma-0">{{ $t('ADD_TO_CART') }}</p>
                                    </v-btn>
                                </v-row>
                                <v-row fill-width class="pa-1 mx-auto">
                                    <v-btn
                                        @click="buyItem(quantity)"
                                        block
                                        outlined
                                        color="primary"
                                        style="height: 50px;"
                                    >
                                        <v-icon left class="d-flex align-center">mdi-play-box-outline</v-icon>
                                        <p class="ma-0">{{ $t('BUY_NOW') }}</p>
                                    </v-btn>
                                </v-row>
                            </v-row>
                        </v-col>
                        <v-col col="12" lg="5" md="4" sm="12" class="d-none d-lg-block">
                            <ItemDescription />
                        </v-col>
                    </v-row>
                    <v-row class="mx-auto d-lg-none">
                        <ItemDescription />
                    </v-row>
                    <v-divider></v-divider>
                    <v-container
                        v-if="itemDetailLoaded"
                        class="mr-3 my-2"
                        style="max-width: none !important; width: 100%;"
                    >
                        <h1 class="my-3">{{ $t('COMMENTS') }}</h1>
                        <v-row class="mx-auto my-3 d-flex" v-for="comment in comments" :key="comment.id">
                            <v-col>
                                <v-card elevation="5" tile>
                                    <v-card-title>
                                        {{ comment.user.name }}
                                        {{ comment.user.lastName }}
                                        <v-rating :value="comment.rating" readonly small></v-rating>
                                    </v-card-title>
                                    <v-card-subtitle>{{ comment.createdAt }}</v-card-subtitle>
                                    <v-card-text>
                                        <p class="body-1 text--primary">{{ comment.comment }}</p>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-container>
            </v-col>
            <v-col cols="12" lg="3" md="4" class="d-none d-md-flex d-lg-flex">
                <ShoppingBar @addItemToCart="addItemToCart" @buyItem="buyItem" :stock="getProductStock" />
            </v-col>
            <DailyRecomendation></DailyRecomendation>
        </v-row>
        <v-snackbar v-model="itemAddedToCart" top :timeout="timeout" color="success">
            {{ isProduct() ? $t('PRODUCT_ADD_TO_CART_SUCCESS') : $t('SERVICE_ADD_TO_CART_SUCCESS') }}
            <v-btn color="white" text @click="itemAddedToCart = false">{{ $t('CLOSE') }}</v-btn>
        </v-snackbar>
        <v-snackbar v-model="itemCartUpdate" top :timeout="timeout" color="success">
            {{ $t('PRODUCT_UPDATE_TO_CART_SUCCESS') }}
            <v-btn color="white" text @click="itemAddedToCart = false">{{ $t('CLOSE') }}</v-btn>
        </v-snackbar>
        <v-snackbar v-model="errorAddingItemToCart" top :timeout="timeout" color="error">
            {{ isProduct() ? $t('PRODUCT_ADD_TO_CART_ERROR') : $t('SERVICE_ADD_TO_CART_ERROR') }}
            <v-btn color="white" text @click="errorAddingItemToCart = false">Cerrar</v-btn>
        </v-snackbar>
        <v-snackbar v-model="errorLoadingContent" top :timeout="timeout" color="error">
            {{ $t('ERROR_LOAD_PRODUCTS') }}
            <v-btn color="white" text @click="closeSnackbar">{{ $t('CLOSE') }}</v-btn>
        </v-snackbar>
    </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {
    layout,
    products,
    authModule,
    carts,
    payments,
    loader,
    comments,
} from '../../../../store/namespaces';
import CartMethods from '@/store/carts/methods/cart.methods';
import ProductsTypes from '@/store/products/methods/products.methods';
import LayoutTypes from '@/store/layout/methods/layout.methods';
import PaymentsTypes from '@/store/payments/methods/payments.methods';
import commentsTypes from '@/store/comments/methods/comments.methods';
import { getDate } from '../../../../utils/date-functions';
import ShoppingBar from './ShoppingBar.vue';
import ItemDescription from './ItemDescription.vue';
import SocialIcons from '@/modules/client/social/components/SocialIcons.vue';
import LoaderTypes from '@/store/loader/methods/loader.methods';
import AuthTypes from '../../../../store/auth/methods/auth.methods';
import * as CART_INTERFACE from '@/modules/client/cart/interfaces/carts.interface';
import { ITEM_TYPE, CURRENCY } from '../../../../config/constants';
import { STATUS } from '@/config/constants';
import DailyRecomendation from '@/modules/client/daily-recomendation/components/DailyRecomendation.vue';
import { CustomerInterface } from '@/modules/client/auth/interfaces/customer.interface';
import { Product } from '@/modules/client/products/interfaces/products.interface';
import { Comment } from '../interfaces/comment.interface';
import { CartInterface, ProductCarts, ServiceCart } from '@/modules/client/cart/interfaces/carts.interface';

@Component({
    components: {
        DailyRecomendation,
        ShoppingBar,
        ItemDescription,
        SocialIcons,
    },
    methods: {
        getDate,
    },
})
export default class ItemDetail extends Vue {
    principalImage = '';
    rating = 3;

    get getProductStock(): string[] {
        var productStock: string[] = [];
        for (var i = 0; i < this.GET_ITEM_DETAIL.productInventory!.availableQuantity!; i++) {
            productStock.push((i + 1).toString());
        }
        return productStock;
    }

    quantity = 0;

    itemDetailLoaded = false;
    errorLoadingContent = false;
    errorAddingItemToCart = false;
    itemAddedToCart = false;
    itemCartUpdate: boolean = false;
    timeout = 5000;

    comments: Comment[] = [];

    splitDate(comments: Comment[]): Comment[] {
        let dateSplit;
        let newDate = '';

        comments.forEach((comment: Comment) => {
            comment.createdAt = comment.createdAt?.slice(0, 10);
        });

        comments.forEach((comment: Comment) => {
            dateSplit = comment.createdAt?.split('-');
            newDate = dateSplit[1] + '/' + dateSplit[2] + '/' + dateSplit[0];
            comment.createdAt = newDate;
            dateSplit = [];
        });

        return comments;
    }

    createOrder(quantity: number) {
        // FIX: Acomodar al implementar el dropdown multimoneda
        const currencyISO = 'USD';
        const currencyId: number = CURRENCY.USD.id;

        const total = `${
            this.getDiscountPrice() !== 0
                ? this.getDiscountPrice() * quantity
                : this.GET_ITEM_DETAIL.price! * quantity
        }`;

        return {
            customer: {
                id: this.GET_CLIENT_DATA.id,
                firstName: this.GET_CLIENT_DATA.name,
                lastName: this.GET_CLIENT_DATA.lastName,
                email: this.GET_CLIENT_DATA.email,
                country: 'US',
            },
            items: [
                {
                    sku: `${this.GET_ITEM_DETAIL.id}`,
                    name: this.GET_ITEM_DETAIL.name,
                    price:
                        this.getDiscountPrice() !== 0
                            ? `${this.getDiscountPrice()}`
                            : `${this.GET_ITEM_DETAIL.price}`,
                    currency: currencyISO,
                    quantity: parseInt(`${quantity}`),
                    type: {
                        id: this.isProduct() ? ITEM_TYPE.PRODUCT : ITEM_TYPE.SERVICE,
                    },
                },
            ],
            amount: {
                total: total,
                currency: currencyISO,
                details: {
                    subtotal: total,
                },
            },
            currency: {
                id: currencyId,
                name: currencyISO,
            },
        };
    }

    async buyItem(quantity: number): Promise<void> {
        if (quantity) {
            const order = this.createOrder(quantity);

            this.SHOW_LOADER(true);

            const paymentUrl: string | boolean = await this.CREATE_ORDER(order);

            if (paymentUrl) {
                this.SHOW_LOADER(false);
                window.open(paymentUrl as string, '_blank');
            }

            this.SHOW_LOADER(false);
        }
    }

    getDiscountPrice(): number {
        let discountPrice = 0;

        this.GET_ITEM_DETAIL.offers.forEach((element) => {
            if (element.offer.status.id === STATUS.ACTIVE) {
                discountPrice = parseFloat(element.discountPrice);
            }
        });

        return discountPrice;
    }

    private async addProductToCart(): Promise<boolean> {
        const productCart: CART_INTERFACE.ProductCarts = {
            quantity: this.quantity,
            user: {
                id: this.GET_CLIENT_DATA.id!,
            },
            product: {
                id: this.GET_ITEM_DETAIL.id!,
                provider: this.GET_ITEM_DETAIL.provider!,
                productPhotos: this.GET_ITEM_DETAIL.productPhotos!,
                productDimension: this.GET_ITEM_DETAIL.productDimension!,
                rating: this.GET_ITEM_DETAIL.rating!,
            },
        };

        return await this.ADD_PRODUCT_TO_CART(productCart);
    }

    async addItemToCart(quantity: number): Promise<void> {
        this.quantity = quantity;
        if (!this.productExistInCart()) {
            const created: boolean = await this.addProductToCart();
            if (created) {
                this.itemAddedToCart = true;
                await this.GET_ITEMS_CARS(this.GET_CLIENT_DATA.id!);
                this.FALSE_PHOTO_CART();
                await this.FETCH_PRODUCT_CART_PHOTO_BY_NAME(this.GET_CART_OBJECT);
            } else {
                this.errorAddingItemToCart = true;
            }
        } else {
            await this.changeQuantity(quantity);
            this.itemCartUpdate = true;
        }
    }

    async changeQuantity(quantity): Promise<void> {
        const index_checkout = await this.GET_PRODUCTS_CHECKOUT.findIndex(
            (productCart) => productCart.product!.id == this.GET_ITEM_DETAIL.id,
        );
        const index = await this.GET_CART_OBJECT.findIndex(
            (productCart) => productCart.product && productCart.product.id == this.GET_ITEM_DETAIL.id,
        );
        const accumulated_quantity = this.GET_CART_OBJECT[index].quantity;
        this.SET_QUANTITY_PRODUCT({
            quantity: typeof quantity == 'string' ? parseInt(quantity) : quantity,
            inCheckout: index_checkout === -1 ? false : true,
            index_checkout,
            index,
        });
    }

    productExistInCart(): boolean {
        const new_product_id: number | undefined = this.GET_ITEM_DETAIL.id;
        let exist: boolean = false;
        this.GET_PRODUCTS_CART.map((product_cart) => {
            if (product_cart.product && product_cart.product.id === new_product_id) {
                exist = true;
            }
        });
        return exist;
    }

    isProduct(): boolean {
        return this.$route.query.item === 'product';
    }

    get imageSelected(): string {
        return this.principalImage;
    }

    changePhotoSelected(imageUrl: string): void {
        this.principalImage = imageUrl;
    }

    closeSnackbar(): void {
        this.errorLoadingContent = false;
    }

    async mounted(): Promise<void> {
        let fetched = false;
        let photosLoaded = false;
        if (this.isProduct()) {
            fetched = await this.FETCH_PRODUCT_DETAIL(Number(this.$route.query.id));
        } else {
            fetched = await this.FETCH_SERVICE_DETAIL(Number(this.$route.query.id));
        }

        if (fetched) {
            if (this.isProduct()) {
                photosLoaded = await this.FETCH_PRODUCT_ITEM_PHOTOS({
                    itemId: this.GET_ITEM_DETAIL.id,
                    item: this.GET_ITEM_DETAIL,
                });
                await this.GET_ALL_PRODUCT_COMMENTS(this.GET_ITEM_DETAIL.id!);
                this.comments = this.PRODUCT_COMMENTS;
                this.comments = this.splitDate(this.comments);
            } else {
                photosLoaded = await this.FETCH_SERVICE_ITEM_PHOTOS({
                    itemId: this.GET_ITEM_DETAIL.id,
                    item: this.GET_ITEM_DETAIL,
                });
            }

            this.principalImage =
                this.GET_ITEM_DETAIL &&
                this.GET_ITEM_DETAIL.productPhotos?.length &&
                this.GET_ITEM_DETAIL.productPhotos[0].imageUrl
                    ? this.GET_ITEM_DETAIL.productPhotos[0].imageUrl!
                    : '';
            this.imageSelected;
        } else {
            this.errorLoadingContent = true;
        }

        if (fetched && photosLoaded) {
            this.itemDetailLoaded = true;
        }
    }

    @loader.Getter(LoaderTypes.getters.IS_LOADING) IS_LOADING!: boolean;
    @carts.Getter(CartMethods.getters.GET_PRODUCTS_CART)
    GET_PRODUCTS_CART!: ProductCarts[];
    @carts.Getter(CartMethods.getters.GET_PRODUCTS_CHECKOUT)
    GET_PRODUCTS_CHECKOUT!: ProductCarts[];
    @loader.Action(LoaderTypes.actions.SHOW_LOADER) SHOW_LOADER!: (loading: boolean) => boolean;
    @payments.Action(PaymentsTypes.actions.CREATE_ORDER) CREATE_ORDER;
    @carts.Getter(CartMethods.getters.GET_CART_OBJECT)
    GET_CART_OBJECT!: ProductCarts[];
    @carts.Action(CartMethods.actions.ADD_PRODUCT_TO_CART)
    ADD_PRODUCT_TO_CART!: (productCart: ProductCarts) => boolean;
    @carts.Action(CartMethods.actions.ADD_SERVICE_TO_CART)
    ADD_SERVICE_TO_CART!: (serviceCart: ServiceCart) => boolean;
    @carts.Action(CartMethods.actions.GET_ITEMS_CARS) GET_ITEMS_CARS!: (clientId: number) => boolean;
    @carts.Action(CartMethods.actions.FETCH_PRODUCT_CART_PHOTO_BY_NAME)
    FETCH_PRODUCT_CART_PHOTO_BY_NAME!: (products: ProductCarts[]) => boolean;
    @carts.Mutation(CartMethods.mutations.SET_QUANTITY_PRODUCT)
    SET_QUANTITY_PRODUCT;

    @products.Getter(ProductsTypes.getters.GET_ITEM_DETAIL)
    GET_ITEM_DETAIL!: Product;

    @products.Action(ProductsTypes.actions.FETCH_PRODUCT_ITEM_PHOTOS)
    FETCH_PRODUCT_ITEM_PHOTOS;
    @products.Action(ProductsTypes.actions.FETCH_SERVICE_ITEM_PHOTOS)
    FETCH_SERVICE_ITEM_PHOTOS;
    @products.Action(ProductsTypes.actions.FETCH_SERVICE_DETAIL)
    FETCH_SERVICE_DETAIL!: (productId: number) => boolean;
    @products.Action(ProductsTypes.actions.FETCH_PRODUCT_DETAIL)
    FETCH_PRODUCT_DETAIL!: (productId: number) => boolean;

    @layout.Getter(LayoutTypes.getters.GET_CATEGORY) GET_CATEGORY!: string;
    @layout.Getter(LayoutTypes.getters.GET_CATEGORY_ID) GET_CATEGORY_ID!: number;
    @layout.Getter(LayoutTypes.getters.GET_CATALOGUE) GET_CATALOGUE!: string;
    @layout.Getter(LayoutTypes.getters.GET_CATALOGUE_ID)
    GET_CATALOGUE_ID!: number;
    @carts.Mutation(CartMethods.mutations.FALSE_PHOTO_CART) FALSE_PHOTO_CART;

    @authModule.Getter(AuthTypes.getters.GET_CLIENT_DATA)
    GET_CLIENT_DATA!: CustomerInterface;

    @comments.Action(commentsTypes.actions.GET_ALL_PRODUCT_COMMENTS) GET_ALL_PRODUCT_COMMENTS!: (
        productId: number,
    ) => boolean;
    @comments.Getter(commentsTypes.getters.GET_COMMENTS) PRODUCT_COMMENTS!: Comment[];
}
</script>

<style scoped>
.container-principal {
    top: 0px;
    background: #ffffff;
}
.image-product {
    height: 450px;
    width: 420px;
}

.v-navigation-drawer--clipped:not(.v-navigation-drawer--temporary):not(.v-navigation-drawer--is-mobile) {
    width: auto !important;
}
</style>
