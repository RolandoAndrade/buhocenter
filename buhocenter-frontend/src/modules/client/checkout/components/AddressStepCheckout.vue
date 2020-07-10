<template>
    <div>
        <v-snackbar v-model="addressCreated" top :timeout="timeout" color="success">
            {{ $t('SUCCESS_ADDRESS') }}
            <v-btn color="white" text @click="addressCreated = false">{{ $t('CLOSE') }}</v-btn>
        </v-snackbar>
        <v-snackbar v-model="addressCreatedError" top :timeout="timeout" color="error">
            {{ $t('ERROR_CREATE_ADDRESS') }}
            <v-btn color="white" text @click="addressCreatedError = false">{{ $t('CLOSE') }}</v-btn>
        </v-snackbar>

        <v-dialog v-model="dialog" max-width="500px" style="background: #ffffff;">
            <div style="background: #ffffff; padding: 40px 30px;">
                <h1 class="text-center overline">{{ $t('ADD_ADDRESS') }}</h1>
                <v-form ref="form" v-model="isFormValid">
                    <v-row class="mx-auto fill-width">
                        <v-col lg="12" xs="12">
                            <v-text-field
                                :label="$t('FIRST_STREET')"
                                @change="modifyFirstStreet"
                                :rules="[rules.required(), rules.fieldLength(65500)]"
                            ></v-text-field>
                        </v-col>
                        <v-col lg="12" xs="12">
                            <v-text-field
                                :label="$t('SECOND_STREET')"
                                @change="modifySecondStreet"
                                :value="secondStreet"
                                :rules="[rules.fieldMaxLength(65500)]"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row class="mx-auto fill-width">
                        <v-col cols="12">
                            <v-text-field
                                :label="$t('CITY')"
                                :value="cityName"
                                :rules="[rules.required(), rules.fieldLength(65500)]"
                                @change="modifyCityName"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row class="mx-auto fill-width">
                        <v-col cols="12">
                            <v-text-field
                                :label="$t('STATE')"
                                :value="state"
                                :rules="[rules.required(), rules.fieldLength(65500)]"
                                @change="modifyState"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row class="mx-auto fill-width">
                        <v-col cols="12">
                            <v-text-field
                                :label="$t('ZIP_CODE')"
                                :value="zipCode"
                                :rules="[rules.fieldMaxLength(65500)]"
                                @change="modifyZipCode"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                </v-form>
                <v-row class="d-flex justify-center my-2">
                    <v-btn outlined color="primary" @click="saveChanges()" :loading="loadingAdd">{{
                        $t('SAVE')
                    }}</v-btn>
                </v-row>
            </div>
        </v-dialog>

        <v-container class="mb-4">
            <v-row justify="center">
                <div>
                    <h2 class="mb-1 mt-0">{{ $t('SHIPPING_ADDRESS') }}</h2>
                    <div class="line"></div>
                </div>
                <br />
                <h5 style="width: 100%; text-align: center;">
                    {{ $t('CELLPHONE') }}
                </h5>
            </v-row>
            <v-row justify="center">
                <v-col cols="12" lg="3">
                    <v-text-field
                        :label="$t('CELLPHONE')"
                        v-model="cellphone"
                        @input="changeCellPhone"
                        v-mask="'+1 (###) ###-####'"
                        :rules="[() => !!cellphone || `${$t('REQUIRED_FIELD')}`]"
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-row justify="center">
                <h5 style="width: 100%; text-align: center;">
                    {{ $t('SELECT_SHIPPING_ADDRESS') }}
                </h5>
            </v-row>
            <v-row>
                <v-row justify="center" v-if="GET_ADDRESSES.length">
                    <v-col
                        cols="3"
                        style="cursor: pointer;"
                        class="fill-height"
                        v-for="address in GET_ADDRESSES"
                        :key="address.id"
                        @click="setDefaultAddress(address.id)"
                    >
                        <v-card
                            class="mx-auto"
                            max-width="344"
                            height="310"
                            fill-height
                            :style="`border: ${address.setDefault ? '2px solid #907F46' : 'none'}`"
                        >
                            <v-card-text class="font-weight-bold">
                                <i
                                    class="fas fa-map-marker-alt mb-4 d-flex justify-center"
                                    :style="`font-size: 40px; color: ${
                                        address.setDefault ? '#907F46' : '#111'
                                    }`"
                                ></i>
                                <p class="ma-0 text-center subtitle text--primary">
                                    {{ address.firstStreet }}
                                </p>
                                <p
                                    v-if="address.secondStreet !== ''"
                                    class="text-center subtitle text--primary"
                                >
                                    {{ address.secondStreet }}
                                </p>
                                <p class="text-center ma-0 subtitle text--primary">
                                    {{ address.city }}
                                </p>
                                <p class="text-center ma-0 subtitle text--primary">
                                    {{ address.state }}
                                </p>
                                <p class="text-center ma-0 subtitle text--primary">
                                    {{ address.zipcode }}
                                </p>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col cols="3" class="fill-height">
                        <v-card
                            class="dashed-card fill-width d-flex align-center"
                            max-height="310px"
                            height="310"
                            fill-width
                            max-width="344"
                            @click="createAddress()"
                        >
                            <v-card-text class="container">
                                <v-row class="d-flex justify-center">
                                    <v-icon x-large>
                                        mdi-plus
                                    </v-icon>
                                </v-row>
                                <v-row class="d-flex justify-center">
                                    <p class="overline text--primary">
                                        {{ $t('ADD_ADDRESS') }}
                                    </p>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row justify="center" v-else>
                    <v-col cols="3" class="mx-auto">
                        <v-card
                            class="dashed-card fill-width d-flex align-center"
                            max-height="310px"
                            height="310"
                            fill-width
                            max-width="344"
                            @click="createAddress()"
                        >
                            <v-card-text class="container">
                                <v-row class="d-flex justify-center">
                                    <v-icon x-large>
                                        mdi-plus
                                    </v-icon>
                                </v-row>
                                <v-row class="d-flex justify-center">
                                    <p class="overline text--primary">
                                        {{ $t('ADD_ADDRESS') }}
                                    </p>
                                </v-row>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-row>
        </v-container>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { addresses, authModule } from '@/store/namespaces';
import AddressTypes from '@/store/addresses/methods/address.methods';
import { Address } from '@/modules/client/addresses/interfaces/address.interface';
import AuthTypes from '@/store/auth/methods/auth.methods';
import rules from '@/utils/rules';
import { CustomerInterface } from '@/modules/client/auth/interfaces/customer.interface';
import { STATUS } from '@/config/constants';
@Component
export default class addressStepCheckout extends Vue {
    public timeout?: number = 2000;
    public cellphone?: string = '';
    public fetchingAddressesError?: boolean = false;
    public defaultAddressError?: boolean = false;
    public dialog?: boolean = false;
    public isFormValid?: boolean = true;
    public addressCreated?: boolean = false;
    public addressCreatedError?: boolean = false;
    public rules = rules;
    public firstStreet?: string = '';
    public secondStreet?: string = '';
    public cityName?: string = '';
    public state?: string = '';
    public zipCode?: string = '';
    loadingAdd: boolean = false;
    $refs!: {
        form;
    };
    public rules_phone = [
        (value) => !!value || 'Required.',
        (value) => (value && value.length >= 3) || 'Min 3 characters',
    ];

    createAddress(): void {
        this.dialog = true;
    }
    createDefaultAddressObject(addressId: number): Address {
        const defaultAddress: Address = {
            id: addressId,
            user: {
                id: this.GET_CLIENT_DATA.id!,
            },
        };
        return defaultAddress;
    }
    async setDefaultAddress(addressId: number): Promise<void> {
        const updated: boolean = await this.SET_DEFAULT_ADDRESS(this.createDefaultAddressObject(addressId));
        if (!updated) {
            this.fetchingAddressesError = true;
        } else {
            await this.fetchAddresses();
        }
    }

    changeCellPhone() {
        this.SET_CUSTOMER_DATA({ ...this.GET_CLIENT_DATA, cellphone: this.cellphone });
    }

    async fetchAddresses(): Promise<void> {
        const fetched: boolean = await this.FETCH_ADDRESSES(this.GET_CLIENT_DATA.id!);
        if (!fetched) {
            this.defaultAddressError = true;
        }
    }
    modifyFirstStreet(value: string): void {
        this.firstStreet = value;
    }
    modifySecondStreet(value: string): void {
        this.secondStreet = value;
    }
    modifyCityName(value: string): void {
        this.cityName = value;
    }
    modifyState(value: string): void {
        this.state = value;
    }
    modifyZipCode(value: string): void {
        this.zipCode = value;
    }
    createAddressObject(): Address {
        const address = {
            firstStreet: this.firstStreet,
            secondStreet: this.secondStreet,
            cityName: this.cityName,
            state: this.state,
            zipcode: this.zipCode,
            user: {
                id: this.GET_CLIENT_DATA.id!,
            },
            status: {
                id: STATUS.ACTIVE,
            },
        };
        return address;
    }

    async saveChanges() {
        if (this.$refs.form.validate()) {
            this.loadingAdd = true;
            const created: boolean = await this.CREATE_ADDRESS(this.createAddressObject());
            if (!created) {
                this.dialog = false;
                this.addressCreatedError = true;
            } else {
                this.addressCreated = true;
                await this.fetchAddresses();
                this.dialog = false;
            }
            this.loadingAdd = false;
        }
    }

    async mounted(): Promise<void> {
        await this.fetchAddresses();
        this.cellphone = this.GET_CLIENT_DATA.cellphone;
    }

    @authModule.Getter(AuthTypes.getters.GET_CLIENT_DATA)
    private GET_CLIENT_DATA!: CustomerInterface;
    @authModule.Mutation(AuthTypes.mutations.SET_CUSTOMER_DATA)
    private SET_CUSTOMER_DATA;

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
