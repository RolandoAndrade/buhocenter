import { Module } from 'vuex';
import CartTypes from '@/store/carts/methods/cart.methods';
import cartsHttpRepository from '@/modules/client/cart/repositories/carts.repository';
import CheckoutRepository from '@/modules/client/checkout/repositories/checkout.repository';
import ProductsFirebaseRepository from '@/modules/client/products/repositories/products.firebase';
import * as CART_INTERFACE from '@/modules/client/cart/interfaces/carts.interface';
import { CARTS_EMPTY_STATE } from './carts.state';
import { CartsStateInterface } from './interfaces/carts.state.interface';
import { ProductCarts, CartInterface } from '@/modules/client/cart/interfaces/carts.interface';
import { PacketBasicInformationInterface } from '@/modules/client/checkout/interfaces/packetBasicInformation.interface';

import { CustomerLoyaltyUpdateProductPointsInterfaces } from '@/modules/client/checkout/interfaces/customerLoyaltyUpdateProductPoints.interfaces';
import { payObjectCheckoutInterfaces } from '@/modules/client/checkout/interfaces/payObjectCheckout.interfaces';
import { NewPayment } from '@/modules/client/checkout/interfaces/newPayment.interface';

const carts: Module<CartsStateInterface, any> = {
    namespaced: true,
    state: CARTS_EMPTY_STATE,
    mutations: {
        [CartTypes.mutations.SET_CART](state, data: ProductCarts[]) {
            if (data) {
                state.cart = data;
                state.checkout = [];
                state.err_cart = false;
                state.err_cart_message = '';
            }
        },
        [CartTypes.mutations.ADD_PRODUCT_CHECKOUT](state, productCart: ProductCarts) {
            const newCheckout = state.checkout;
            newCheckout.push({ ...productCart, hasInsurance: false });
            state.checkout = newCheckout;
        },
        [CartTypes.mutations.REMOVE_PRODUCT_CHECKOUT](state, index: number) {
            const newCheckout = state.checkout;
            newCheckout.splice(index, 1);
            state.checkout = newCheckout;
        },
        [CartTypes.mutations.SET_QUANTITY_PRODUCT](
            state,
            data: {
                quantity: number;
                inCheckout: boolean;
                index_checkout: number;
                index: number;
            },
        ) {
            const new_cart = state.cart;
            new_cart![data.index].quantity = data.quantity;
            if (data.inCheckout) {
                const new_checkout = state.checkout;
                new_checkout[data.index_checkout].quantity = data.quantity;
                state.checkout = new_checkout;
            }
            state.cart = new_cart;
        },
        [CartTypes.mutations.REMOVE_PRODUCT_CART](state, index: number) {
            const new_cart = state.cart;
            new_cart!.splice(index, 1);
            state.cart = new_cart;
        },
        [CartTypes.mutations.SET_PRODUCTS_CART](state, products: ProductCarts[]) {
            state.cart = products;
            state.load_photo_cart = true;
        },
        [CartTypes.mutations.FALSE_PHOTO_CART](state) {
            state.load_photo_cart = false;
        },
        [CartTypes.mutations.SET_TENTATIVE_POINTS_PRODUCTS_CHECKOUT](state, products: ProductCarts[]) {
            state.checkout = products;
        },
        [CartTypes.mutations.SET_INFO_SHIP_THIS_CHECKOUT](state, { newCheckout, destination }) {
            state.checkout = newCheckout;
            state.destination = destination;
        },
    },
    getters: {
        [CartTypes.getters.GET_CART_OBJECT](state): ProductCarts[] {
            return state.cart;
        },
        [CartTypes.getters.GET_PRODUCTS_CART](state): ProductCarts[] {
            return state.cart!;
        },
        [CartTypes.getters.GET_PRODUCTS_CHECKOUT](state): ProductCarts[] {
            return state.checkout;
        },
        [CartTypes.getters.GET_DESTINATION](state): string {
            return state.destination;
        },
        [CartTypes.getters.GET_TOTAL_PRICE_CHECKOUT](state): number {
            const { checkout } = state;
            let price = 0;
            checkout.map((productCart) => {
                const { product } = productCart;
                const { quantity } = productCart;
                if (product!.offer && product!.offer.discountPrice) {
                    price += parseFloat(product!.offer.discountPrice) * quantity!;
                } else {
                    price += product!.price! * quantity!;
                }
            });
            return price;
        },
        [CartTypes.getters.GET_LOAD_PHOTO_CART](state): boolean {
            return state.load_photo_cart;
        },
    },
    actions: {
        async [CartTypes.actions.ADD_PRODUCT_TO_CART](
            { commit },
            productCart: ProductCarts,
        ): Promise<boolean> {
            try {
                await cartsHttpRepository.addProductToCart(productCart);
                return true;
            } catch (e) {
                return false;
            }
        },
        async [CartTypes.actions.ADD_SERVICE_TO_CART](
            { commit },
            serviceCart: CART_INTERFACE.ServiceCart,
        ): Promise<boolean> {
            try {
                await cartsHttpRepository.addServiceToCart(serviceCart);
                return true;
            } catch (e) {
                return false;
            }
        },
        async [CartTypes.actions.GET_ITEMS_CARS]({ commit }, clientId: number): Promise<boolean> {
            try {
                const response: ProductCarts[] | boolean = await cartsHttpRepository.getItemsCars(clientId);
                if (response) {
                    commit(CartTypes.mutations.SET_CART, response);
                    return true;
                }
                return false;
            } catch (e) {
                return false;
            }
        },
        async [CartTypes.actions.GET_PETROMILES_POINTS_ITEMS_CHECKOUT](
            { commit, state },
            products: CustomerLoyaltyUpdateProductPointsInterfaces,
        ): Promise<boolean> {
            const response = await CheckoutRepository.updateProductPoints(products);
            if (response) {
                const newCheckout = state.checkout;
                newCheckout.map(({ product }) => {
                    response.map((product_points) => {
                        if (
                            product &&
                            product.id === product_points.id &&
                            product_points.canAccumulatePoints
                        ) {
                            product.tentativePoints = product_points.tentativePoints;
                        }
                    });
                });
                commit(CartTypes.mutations.SET_TENTATIVE_POINTS_PRODUCTS_CHECKOUT, newCheckout);
            }
            return true;
        },
        async [CartTypes.actions.GET_SHIPTHIS_INFO_PRODUCTS_CHECKOUT](
            { commit, state },
            packageInfo: PacketBasicInformationInterface,
        ): Promise<boolean> {
            try {
                const response = await CheckoutRepository.sendPacketInfo(packageInfo);

                if (response) {
                    const oldCheckout = state.checkout;
                    const newCheckout = [];
                    const destination = response.destination;
                    oldCheckout.map((productCheckout) => {
                        let { product } = productCheckout;
                        response.packages.map((pack) => {
                            if (product?.name === pack?.description) {
                                // @ts-ignore
                                product.priceInsurance = pack.cost;
                            }
                        });
                        productCheckout.product = product;
                        // @ts-ignore
                        newCheckout.push(productCheckout);
                    });
                    commit(CartTypes.mutations.SET_INFO_SHIP_THIS_CHECKOUT, {
                        newCheckout,
                        destination,
                    });
                    return true;
                }
                return false;
            } catch (e) {
                return false;
            }
        },
        async [CartTypes.actions.FETCH_PAYMENT_CHECKOUT](
            { commit },
            payObjectCheckout: payObjectCheckoutInterfaces,
        ): Promise<{ success: boolean; payment: NewPayment | null }> {
            try {
                const response: NewPayment = await CheckoutRepository.paymentOrders(payObjectCheckout);
                if (response) {
                    return {
                        success: true,
                        payment: response,
                    };
                }
                return {
                    success: false,
                    payment: null,
                };
            } catch (e) {
                return {
                    success: false,
                    payment: null,
                };
            }
        },
        async [CartTypes.actions.FETCH_PRODUCT_CART_PHOTO_BY_NAME](
            { commit },
            products: ProductCarts[],
        ): Promise<boolean> {
            try {
                for (let i = 0; i < products.length; i++) {
                    products[i].product!.imageUrl = await ProductsFirebaseRepository.getProductPhotoByName(
                        products[i].product!.id!,
                        products[i].product!.productPhotos![0].content!,
                    );
                }

                commit(CartTypes.mutations.SET_PRODUCTS_CART, products);
                return false;
            } catch (e) {
                return false;
            }
        },
        async [CartTypes.actions.DELETE_PRODUCT_CART](
            { commit },
            data: { productCartId: number; index: number },
        ): Promise<boolean> {
            try {
                const response = await cartsHttpRepository.deleteProductCart(data.productCartId);
                if (response) {
                    commit(CartTypes.mutations.REMOVE_PRODUCT_CART, data.index);
                    return true;
                }
                return false;
            } catch (e) {
                return false;
            }
        },
        [CartTypes.actions.EMPTY_CART]({ commit }): void {
            const emptyCart = {
                cart: {},
                checkout: [],
                err_cart: false,
                err_cart_message: false,
            };
            commit(CartTypes.mutations.SET_CART, emptyCart);
        },
    },
};
export default carts;
