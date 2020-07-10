<template>
    <v-container>
        <v-row class="logo-header justify-center d-flex">
            <img src="../assets/Logo-completo.png" class="logo-header__img" />
        </v-row>
        <h1 class="text-center">Checkout</h1>

        <v-stepper v-model="step" style="background: none; box-shadow: none;">
            <v-stepper-header style="background: none; box-shadow: none;">
                <v-stepper-step :complete="step > 0" step="1">
                    {{ $t('SHIPPING_ADDRESS') }}
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step :complete="step > 1" step="2">
                    {{ $t('PACKAGE_INSURANCE') }}
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step :complete="step > 2" step="3">
                    {{ $t('PAYMENT_DETAIL') }}
                </v-stepper-step>
            </v-stepper-header>

            <v-stepper-content step="1">
                <address-step-checkout></address-step-checkout>
                <div
                    class="d-flex justify-center"
                    v-if="step === 1"
                    style="background: none; box-shadow: none;"
                >
                    <v-btn text class="mx-3"
                        ><router-link to="/home">{{ $t('CANCEL') }}</router-link></v-btn
                    >
                    <v-btn
                        class="mx-3"
                        color="primary"
                        @click="validateFirstStep()"
                        :disabled="fetchFirstStep"
                    >
                        <v-progress-circular
                            indeterminate
                            color="primary"
                            v-if="fetchFirstStep"
                        ></v-progress-circular>
                        <span v-else>{{ $t('CONTINUE') }}</span>
                    </v-btn>
                </div>
            </v-stepper-content>

            <v-stepper-content step="2">
                <package-insurance-step></package-insurance-step>
                <div class="d-flex justify-center" v-if="step === 2">
                    <v-btn text class="mx-3" @click="step = 1">Back</v-btn>
                    <v-btn
                        class="mx-3"
                        color="primary"
                        @click="validateSecondStep()"
                        :disabled="fetchSecondStep"
                    >
                        <v-progress-circular
                            indeterminate
                            color="primary"
                            v-if="fetchSecondStep"
                        ></v-progress-circular>
                        <span v-else>{{ $t('CONTINUE') }}</span>
                    </v-btn>
                </div>
            </v-stepper-content>

            <v-stepper-content step="3">
                <payment-detail></payment-detail>
                <div class="d-flex justify-center" v-if="step === 3">
                    <v-btn text class="mx-3" @click="step = 2">Back</v-btn>
                    <v-btn color="primary" class="mx-3" @click="goPay()" :disabled="fetchThirdStep">
                        <v-progress-circular
                            indeterminate
                            color="primary"
                            v-if="fetchThirdStep"
                        ></v-progress-circular>
                        <span v-else>{{ $t('PAY') }}</span>
                    </v-btn>
                </div>
            </v-stepper-content>
        </v-stepper>
        <v-snackbar v-model="firstStepError" top color="error" class="mt-12">
            {{ $t('ERROR_FIRST_STEP_CHECKOUT') }}
            <v-btn color="white" text @click="firstStepError = false">{{ $t('CLOSE') }}</v-btn>
        </v-snackbar>
        <v-snackbar v-model="thirdStepError" top color="error" class="mt-12">
            {{ $t('ERROR_THIRD_STEP_CHECKOUT') }}
            <v-btn color="white" text @click="thirdStepError = false">{{ $t('CLOSE') }}</v-btn>
        </v-snackbar>
    </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { addresses, authModule, carts } from '@/store/namespaces';
import AddressTypes from '@/store/addresses/methods/address.methods';
import { Address } from '@/modules/client/addresses/interfaces/address.interface';
import AuthTypes from '@/store/auth/methods/auth.methods';
import { CustomerInterface } from '@/modules/client/auth/interfaces/customer.interface';
import AddressStepCheckout from '@/modules/client/checkout/components/AddressStepCheckout.vue';
import PackageInsuranceStep from '@/modules/client/checkout/components/PackageInsuranceStep.vue';
import CartTypes from '@/store/carts/methods/cart.methods';
import { ProductCarts } from '@/modules/client/cart/interfaces/carts.interface';
import CartMethods from '@/store/carts/methods/cart.methods';
import { PacketBasicInformationInterface } from '@/modules/client/checkout/interfaces/packetBasicInformation.interface';
import { CustomerLoyaltyUpdateProductPointsInterfaces } from '@/modules/client/checkout/interfaces/customerLoyaltyUpdateProductPoints.interfaces';
import PaymentDetail from '@/modules/client/checkout/components/PaymentDetail.vue';
import { payObjectCheckoutInterfaces } from '@/modules/client/checkout/interfaces/payObjectCheckout.interfaces';
import { NewPayment } from '@/modules/client/checkout/interfaces/newPayment.interface';
@Component({
    components: { PaymentDetail, PackageInsuranceStep, AddressStepCheckout },
})
export default class Checkout extends Vue {
    public step?: number = 1;
    public firstStepError?: boolean = false;
    public secondStepError?: boolean = false;
    public thirdStepError?: boolean = false;
    public fetchFirstStep?: boolean = false;
    public fetchSecondStep?: boolean = false;
    public fetchThirdStep?: boolean = false;

    async validateFirstStep(): Promise<void> {
        if (this.GET_ADDRESSES.length > 0 && this.GET_CLIENT_DATA.cellphone !== '') {
            const address = this.GET_ADDRESSES.find((address) => address.setDefault);
            if (address) {
                const user_base = this.GET_CLIENT_DATA;

                const carts_base = this.GET_PRODUCTS_CHECKOUT;
                const productCarts: {
                    description: string | undefined;
                    productDimension: {
                        weight: number | string | undefined;
                        long: number | string | undefined;
                        width: number | string | undefined;
                        height: number | string | undefined;
                    };
                    fragile: boolean | undefined;
                    hasInsurance: boolean | undefined;
                    quantity: number | undefined;
                }[] = [];
                carts_base.map((cart) => {
                    productCarts.push({
                        description: cart.product?.name,
                        fragile: cart.product?.fragile,
                        hasInsurance: cart.hasInsurance,
                        quantity: cart.quantity,
                        productDimension: {
                            weight: cart.product?.productDimension?.weight,
                            height: cart.product?.productDimension?.height,
                            width: cart.product?.productDimension?.width,
                            long: cart.product?.productDimension?.long,
                        },
                    });
                });
                const currentlyAmount = this.GET_TOTAL_PRICE_CHECKOUT;
                const user = {
                    name: user_base.name,
                    lastName: user_base.lastName,
                    email: user_base.email,
                    cellphone: user_base.cellphone,
                    address,
                };
                this.fetchFirstStep = true;
                const response = await this.GET_SHIPTHIS_INFO_PRODUCTS_CHECKOUT({
                    user,
                    productCarts,
                    currentlyAmount,
                });
                this.fetchFirstStep = false;
                if (response) {
                    this.step = 2;
                    this.firstStepError = false;
                } else {
                    this.firstStepError = true;
                }
            }
        } else {
            this.firstStepError = true;
        }
    }

    async validateSecondStep(): Promise<void> {
        const user = this.GET_CLIENT_DATA;
        const carts = this.GET_PRODUCTS_CHECKOUT;
        let products: { id: number; price: number; canAccumulatePoints: boolean | undefined }[] = [];
        carts.map((cart_product) => {
            let price: number = 0;
            const { product } = cart_product;
            const { quantity } = cart_product;
            if (product) {
                const id = product.id;
                const canAccumulatePoints = product.canAccumulatePoints;
                if (product!.offer && product!.offer.discountPrice) {
                    price += parseFloat(product!.offer.discountPrice) * quantity!;
                } else {
                    price += product!.price! * quantity!;
                }
                if (id) {
                    products.push({
                        id,
                        price,
                        canAccumulatePoints,
                    });
                }
            }
        });
        this.fetchSecondStep = true;
        const response = await this.GET_PETROMILES_POINTS_ITEMS_CHECKOUT({
            user: {
                id: user.id,
            },
            products,
        });
        if (response) {
            this.step = 3;
            this.secondStepError = false;
        } else {
            this.secondStepError = true;
        }
        this.fetchSecondStep = false;
    }

    async goPay(): Promise<void> {
        const address = this.GET_ADDRESSES.find((address) => address.setDefault);
        const foreignExchange: { id: number } = { id: 1 };
        const carts = this.GET_PRODUCTS_CHECKOUT;
        let cartsForPayment: {
            id: number | undefined;
            quantity: number;
            productPrice: number;
            offerPrice: number;
            productPoints: number | undefined;
            product: {
                id: number;
                hasInsurance: boolean | undefined;
                fragile: boolean | undefined;
                description: string | undefined;
                productDimensions: {
                    width: string | undefined;
                    height: string | undefined;
                    long: string | undefined;
                    weight: string | undefined;
                };
            };
        }[] = [];
        carts.map((product_cart) => {
            const { product, quantity, id } = product_cart;
            if (product && product.id && product.price && quantity) {
                cartsForPayment.push({
                    id,
                    quantity: quantity,
                    productPrice: product?.price,
                    offerPrice:
                        product?.offer && product?.offer.discountPrice
                            ? product?.offer.discountPric
                            : product?.price,
                    productPoints: product?.canAccumulatePoints ? product.tentativePoints : 0,
                    product: {
                        id: product?.id,
                        hasInsurance: product?.hasInsurance,
                        fragile: product?.fragile,
                        description: product?.name,
                        productDimensions: {
                            weight: product?.productDimension?.weight,
                            height: product?.productDimension?.height,
                            width: product?.productDimension?.width,
                            long: product?.productDimension?.long,
                        },
                    },
                });
            }
        });
        if (address) {
            this.fetchThirdStep = true;
            //@ts-ignore
            const response: {
                success: boolean;
                payment: NewPayment | null;
            } = await this.FETCH_PAYMENT_CHECKOUT({
                cellphone: this.GET_CLIENT_DATA.cellphone,
                address: {
                    id: address.id,
                    firstStreet: address.firstStreet,
                    secondStreet: address.secondStreet,
                    city: address.city,
                    state: address.state,
                    zipcode: address.zipcode,
                },
                foreignExchange,
                cartsForPayment,
            });
            this.fetchThirdStep = false;
            if (response.success) {
                //@ts-ignore
                window.location.replace(response?.payment?.order?.payment_url);
            } else {
                this.thirdStepError = true;
            }
        }
    }

    @carts.Getter(CartTypes.getters.GET_PRODUCTS_CHECKOUT)
    private GET_PRODUCTS_CHECKOUT!: ProductCarts[];
    @carts.Getter(CartMethods.getters.GET_TOTAL_PRICE_CHECKOUT)
    GET_TOTAL_PRICE_CHECKOUT!: number;
    @carts.Action(CartTypes.actions.GET_PETROMILES_POINTS_ITEMS_CHECKOUT)
    private GET_PETROMILES_POINTS_ITEMS_CHECKOUT!: (
        products: CustomerLoyaltyUpdateProductPointsInterfaces,
    ) => boolean;
    @carts.Action(CartTypes.actions.GET_SHIPTHIS_INFO_PRODUCTS_CHECKOUT)
    private GET_SHIPTHIS_INFO_PRODUCTS_CHECKOUT!: (packageInfo: PacketBasicInformationInterface) => boolean;
    @carts.Action(CartTypes.actions.FETCH_PAYMENT_CHECKOUT)
    private FETCH_PAYMENT_CHECKOUT!: (packageInfo: payObjectCheckoutInterfaces) => boolean;

    @authModule.Getter(AuthTypes.getters.GET_CLIENT_DATA)
    private GET_CLIENT_DATA!: CustomerInterface;
    @addresses.Action(AddressTypes.actions.CREATE_ADDRESS)
    private CREATE_ADDRESS!: (address: Address) => boolean;
    @addresses.Action(AddressTypes.actions.SET_DEFAULT_ADDRESS)
    private SET_DEFAULT_ADDRESS!: (defaultAddress: Address) => boolean;
    @addresses.Getter(AddressTypes.getters.GET_ADDRESSES)
    private GET_ADDRESSES!: Address[];
    @addresses.Action(AddressTypes.actions.FETCH_ADDRESSES)
    private FETCH_ADDRESSES!: (customerId: number) => boolean;
}
</script>
