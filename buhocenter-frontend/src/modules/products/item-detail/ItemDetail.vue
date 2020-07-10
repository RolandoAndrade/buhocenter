<template>
    <v-container class="mt-5" style="max-width: none !important; background: #ffffff;">
        <v-row>
            <v-col cols="12" lg="9" md="8" sm="12">
                <v-container fluid class="mt-5" style="max-width: none !important; width: 100%;">
                    <v-row>
                        <v-col
                            cols="12"
                            offset-lg="1"
                            offset-md="1"
                            offset-sm="0"
                            col-lg="10"
                            col-md="10"
                            col-sm="12"
                        >
                            <p class="overline font-weight-light caption" style="word-break: break-word;">
                                <RouterLink :to="`/catalogues?category_id=${GET_CATEGORY_ID}`">
                                    {{ $t(GET_CATEGORY) }} </RouterLink
                                >>
                                <RouterLink
                                    :to="`/products?category_id=${GET_CATEGORY_ID}&catalogue_id=${GET_CATALOGUE_ID}`"
                                >
                                    {{ $t(GET_CATALOGUE) }}
                                </RouterLink>
                            </p>
                        </v-col>
                    </v-row>
                    <v-row v-if="itemDetailLoaded" class="pa-0">
                        <v-col cols="12" lg="1" md="1" sm="2" class="justify-center ma-0">
                            <div v-for="photo in GET_ITEM_DETAIL.photos" :key="photo.imageUrl">
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
                                        :items="quantityValues"
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
                        <h3 class="my-3">{{ $t('QUESTION_ANSWERS') }}</h3>
                        <v-row
                            class="mx-auto my-3 d-flex"
                            v-for="question of GET_ITEM_DETAIL.questions"
                            :key="question.id"
                        >
                            <v-col cols="10">
                                {{ question.comment }}
                                <div class="overline">
                                    {{ getDate(question.createdAt) }}
                                </div>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-container>
            </v-col>
            <v-col cols="12" lg="3" md="4" class="d-none d-md-flex d-lg-flex">
                <ShoppingBar @addItemToCart="addItemToCart" @buyItem="buyItem" />
            </v-col>
            <DailyRecomendation></DailyRecomendation>
        </v-row>
        <v-snackbar v-model="itemAddedToCart" top :timeout="timeout" color="success">
            {{ isProduct() ? $t('PRODUCT_ADD_TO_CART_SUCCESS') : $t('SERVICE_ADD_TO_CART_SUCCESS') }}
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
import { layout, products, authModule, carts, payments, loader } from '../../../store/namespaces';
import CartMethods from '@/store/carts/methods/cart.methods';
import { getDate } from '../../../utils/date-functions';
import ShoppingBar from './ShoppingBar.vue';
import ItemDescription from './ItemDescription.vue';
import SocialIcons from '../../social/SocialIcons.vue';
import AuthTypes from '../../../store/auth/methods/auth.methods';
import LoaderTypes from '../../../store/loader/methods/loader.methods';
import PaymentTypes from '../../../store/payments/methods/payments.methods';
import ProductTypes from '../../../store/products/methods/products.methods';
import LayoutTypes from '../../../store/layout/methods/layout.methods';
import { ITEM_TYPE, CURRENCY } from '../../../config/constants';
import { STATUS } from '@/config/constants';
import DailyRecomendation from '@/modules/products/daily-recomendation/DailyRecomendation.vue';
import { ProductCarts, ServiceCart } from '@/modules/client/cart/interfaces/carts.interface';

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
    principalImage: string = '';
    quantityValues: string[] = [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20',
        '21',
        '22',
        '23',
        '25',
        '26',
        '27',
        '28',
        '29',
        '30',
    ];
    quantity: number = 0;

    itemDetailLoaded: boolean = false;
    errorLoadingContent: boolean = false;
    errorAddingItemToCart: boolean = false;
    itemAddedToCart: boolean = false;
    timeout: number = 5000;

    createOrder(quantity: number) {
        // FIX: Acomodar al implementar el dropdown multimoneda
        const currencyISO: string = 'USD';
        const currencyId: number = CURRENCY.USD.id;

        const total: string = `${
            this.getDiscountPrice() !== 0
                ? this.getDiscountPrice() * quantity
                : this.GET_ITEM_DETAIL.price * quantity
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
        let discountPrice: number = 0;

        this.GET_ITEM_DETAIL.offers.forEach((element) => {
            if (element.offer.status.id === STATUS.ACTIVE) {
                discountPrice = parseFloat(element.discountPrice);
            }
        });

        return discountPrice;
    }

    private async addProductToCart() {
        const productCart: ProductCarts = {
            quantity: this.quantity,
            user: {
                id: this.GET_CLIENT_DATA.id,
            },
            product: {
                id: this.GET_ITEM_DETAIL.id,
                productPhotos: [],
                provider: {
                    createdAt: '',
                    id: 0,
                    name: '',
                    updatedAt: '',
                },
                productDimension: {
                    width: '',
                    height: '',
                    long: '',
                    weight: '',
                },
                rating: '',
            },
        };

        return await this.ADD_PRODUCT_TO_CART(productCart);
    }

    private async addServiceToCart() {
        const serviceCart: ServiceCart = {
            quantity: this.quantity,
            customer: {
                id: this.GET_CLIENT_DATA.id,
            },
        };

        return await this.ADD_SERVICE_TO_CART(serviceCart);
    }

    async addItemToCart(quantity: number) {
        let created: boolean;

        this.quantity = quantity;

        if (this.isProduct()) {
            created = await this.addProductToCart();
        } else {
            created = await this.addServiceToCart();
        }

        if (created) {
            this.itemAddedToCart = true;
            await this.GET_ITEMS_CARS(this.GET_CLIENT_DATA.id);
            this.FALSE_PHOTO_CART();
            await this.FETCH_PRODUCT_CART_PHOTO_BY_NAME(this.GET_CART_OBJECT.productCarts);
        } else {
            this.errorAddingItemToCart = true;
        }
    }

    isProduct(): boolean {
        if (this.$route.query.item === 'product') {
            return true;
        }

        return false;
    }

    itemQuantity(quantity: number): void {
        this.quantity = quantity;
    }

    get imageSelected(): string {
        return this.principalImage;
    }

    changePhotoSelected(imageUrl: string): void {
        this.principalImage = imageUrl;
    }

    closeSnackbar() {
        this.errorLoadingContent = false;
    }

    async mounted() {
        let fetched: boolean = false;
        let photosLoaded: boolean = false;

        if (this.isProduct()) {
            fetched = await this.FETCH_PRODUCT_DETAIL(this.$route.query.id);
        } else {
            fetched = await this.FETCH_SERVICE_DETAIL(this.$route.query.id);
        }

        if (fetched) {
            if (this.isProduct()) {
                photosLoaded = await this.FETCH_PRODUCT_ITEM_PHOTOS({
                    itemId: this.GET_ITEM_DETAIL.id,
                    item: this.GET_ITEM_DETAIL,
                });
            } else {
                photosLoaded = await this.FETCH_SERVICE_ITEM_PHOTOS({
                    itemId: this.GET_ITEM_DETAIL.id,
                    item: this.GET_ITEM_DETAIL,
                });
            }

            this.principalImage = this.GET_ITEM_DETAIL.photos[0].imageUrl;
        } else {
            this.errorLoadingContent = true;
        }

        if (fetched && photosLoaded) {
            this.itemDetailLoaded = true;
        }
    }

    @loader.Getter(LoaderTypes.getters.IS_LOADING) IS_LOADING;
    @loader.Action(LoaderTypes.actions.SHOW_LOADER) SHOW_LOADER;

    @payments.Action(PaymentTypes.actions.CREATE_ORDER) private CREATE_ORDER;

    @carts.Getter(CartMethods.getters.GET_CART_OBJECT) GET_CART_OBJECT;
    @carts.Action(CartMethods.actions.ADD_PRODUCT_TO_CART) private ADD_PRODUCT_TO_CART;
    @carts.Action(CartMethods.actions.ADD_SERVICE_TO_CART) private ADD_SERVICE_TO_CART;
    @carts.Action(CartMethods.actions.GET_ITEMS_CARS) GET_ITEMS_CARS;
    @carts.Action(CartMethods.actions.FETCH_PRODUCT_CART_PHOTO_BY_NAME) FETCH_PRODUCT_CART_PHOTO_BY_NAME;

    @products.Getter(ProductTypes.getters.GET_ITEM_DETAIL) private GET_ITEM_DETAIL;
    @products.Action(ProductTypes.actions.FETCH_PRODUCT_ITEM_PHOTOS) private FETCH_PRODUCT_ITEM_PHOTOS;
    @products.Action(ProductTypes.actions.FETCH_SERVICE_ITEM_PHOTOS) private FETCH_SERVICE_ITEM_PHOTOS;
    @products.Action(ProductTypes.actions.FETCH_SERVICE_DETAIL) private FETCH_SERVICE_DETAIL;
    @products.Action(ProductTypes.actions.FETCH_PRODUCT_DETAIL) private FETCH_PRODUCT_DETAIL;

    @layout.Getter(LayoutTypes.getters.GET_CATEGORY) private GET_CATEGORY;
    @layout.Getter(LayoutTypes.getters.GET_CATEGORY_ID) private GET_CATEGORY_ID;
    @layout.Getter(LayoutTypes.getters.GET_CATALOGUE) private GET_CATALOGUE;
    @layout.Getter(LayoutTypes.getters.GET_CATALOGUE_ID) private GET_CATALOGUE_ID;
    @carts.Mutation(CartMethods.mutations.FALSE_PHOTO_CART) FALSE_PHOTO_CART;

    @authModule.Getter(AuthTypes.getters.GET_CLIENT_DATA) private GET_CLIENT_DATA;
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
