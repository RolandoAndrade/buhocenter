<template>
    <v-container fluid>
        <v-dialog v-model="dialog" max-width="500px" style="background: #ffffff">
            <div style="background: #ffffff; padding: 40px 30px" >
                <h1 class="text-center overline">{{$t('ADD_ADDRESS')}}</h1>
                <v-form ref="form" v-model="isFormValid" >
                    <v-row class="mx-auto fill-width">
                        <v-col lg="12" xs="12">
                            <v-text-field
                                    :label="$t('FIRST_STREET')"
                                    @change="modifyFirstStreet"
                                    :rules="[
                                        rules.required(),
                                        rules.fieldLength(65500),
                                    ]"
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
                            <v-text-field :label="$t('STATE')"
                                          :value="state"
                                          :rules="[rules.required(), rules.fieldLength(65500)]"
                                          @change="modifyState"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row class="mx-auto fill-width">
                        <v-col cols="12">
                            <v-text-field :label="$t('ZIP_CODE')"
                                          :value="zipCode"
                                          :rules="[rules.fieldMaxLength(65500)]"
                                          @change="modifyZipCode"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                </v-form>
                <v-row class="d-flex justify-center my-2" @click="saveChanges()">
                    <v-btn outlined color="primary">{{$t('SAVE')}}</v-btn>
                </v-row>
            </div>
        </v-dialog>
        <v-img
                src="../../../assets/images/direction.jpg"
                height="125"
                class="grey darken-4"
        ></v-img>
        <h1 class="overline text-center"> {{$t('YOUR_ADDRESSES')}} </h1>
        <v-row>
            <v-col cols="2" class="mx-auto">
                <v-card
                    class="dashed-card fill-width"
                    fill-height
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
                                {{$t('ADD_ADDRESS')}}
                            </p>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-row v-if="GET_ADDRESSES.length">
                <v-col cols="3"
                    class="fill-height"
                    v-for="address in GET_ADDRESSES"
                    :key="address.id"
                >
                    <v-card
                        class="mx-auto"
                        max-width="344"
                        height="310"
                        fill-height
                        :style="`border: ${address.setDefault?'2px solid #907F46':'none'}`"
                    >
                        <v-card-text class="font-weight-bold">
                            <p class="ma-0 text-center subtitle text--primary">
                                {{ address.firstStreet }}
                            </p>
                            <p v-if="address.secondStreet !== ''" class="text-center subtitle text--primary">
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
                            <p v-if="address.setDefault" class="text-center ma-0 caption text--primary">
                                <b>DEFAULT ADDRESS</b>
                            </p>
                        </v-card-text>
                        <v-card-actions class="text-center d-flex justify-center">
                            <v-row class="d-flex justify-center">
                                <v-col v-if="!address.setDefault" sm="12" :class="{ 'pa-0': $vuetify.breakpoint.mdAndDown }">
                                    <v-btn
                                    color="primary"
                                    outlined
                                    class="btn-remove"
                                    :x-small="$vuetify.breakpoint.mdAndDown"
                                    @click="setDefaultAddress(address.id)"
                                    text >
                                        Set as default
                                    </v-btn>
                                </v-col>
                                <v-col sm="12">
                                    <v-btn
                                    color="primary"
                                    class="btn-remove"
                                    :x-small="$vuetify.breakpoint.mdAndDown"
                                    @click="deletAddress(address.id)"
                                    >
                                        {{$t('REMOVE')}}
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-row>
        <v-snackbar v-model="defaultAddressError" top :timeout="timeout" color="error">
            {{$t('ERROR_PUT_ADDRESS')}}
            <v-btn color="white" text @click="defaultAddressError = false">{{ $t('CLOSE') }}</v-btn>
        </v-snackbar>
        <v-snackbar v-model="fetchingAddressesError" top :timeout="timeout" color="error">
            {{$t('ERROR_GET_ADDRESS')}}
            <v-btn color="white" text @click="fetchingAddressesError = false">{{ $t('CLOSE') }}</v-btn>
        </v-snackbar>
        <v-snackbar v-model="deletingAddressError" top :timeout="timeout" color="error">
            {{$t('ERROR_DELETE_ADDRESS')}}
            <v-btn color="white" text @click="deletingAddressError = false">{{ $t('CLOSE') }}</v-btn>
        </v-snackbar>
        <v-snackbar v-model="addressCreated" top :timeout="timeout" color="success">
             {{ $t('SUCCESS_ADDRESS') }}
            <v-btn color="white" text @click="addressCreated = false">{{ $t('CLOSE') }}</v-btn>
        </v-snackbar>
        <v-snackbar v-model="addressCreatedError" top :timeout="timeout" color="error">
             {{ $t('ERROR_PUT_ADDRESS') }}
            <v-btn color="white" text @click="addressCreatedError = false">{{ $t('CLOSE') }}</v-btn>
        </v-snackbar>
    </v-container>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { addresses, authModule } from "@/store/namespaces";
import AuthTypes from '../../../store/auth-module/methods/auth-methods';
import AddressTypes from '@/store/addresses/methods/address-methods';
import CreateAddressForm from "@/modules/customers/addresses/CreateAddressForm.vue";
import {STATUS} from "@/config/constants";
import rules from '@/utils/rules';

@Component({
    components:{CreateAddressForm}
})
export default class AddressManagement extends Vue {
    defaultAddressError: boolean = false;
    fetchingAddressesError: boolean = false;
    deletingAddressError: boolean = false;
    addressCreated: boolean = false;
    dialog: boolean = false;
    timeout: number = 5000;
    isFormValid: boolean = true;
    addressCreatedError: boolean = false;
    rules: any = rules;
    firstStreet: string = '';
    secondStreet: string = '';
    cityName: string = '';
    state: string = '';
    zipCode: string = '';
    $refs!: {
        form: any;
    };

    async createAddress() {
        this.dialog = true;
        //this.$router.push({ name: 'create-address' });
    }

    createDefaultAddressObject(addressId: number) {
        const defaultAddress = {
            id: addressId,
            customer: {
                id: this.GET_CLIENT_DATA.id,
            }
        }

        return defaultAddress;
    }

    async deletAddress(addressId: number) {
        const deleted: boolean = await this.DELETE_ADDRESS(addressId);

        if (!deleted) {
            this.deletingAddressError = true;
        } else {
            await this.fetchAddresses();
            this.$router.go(0);
        }   
    }

    async setDefaultAddress(addressId: number) {
        const updated: boolean = await this.SET_DEFAULT_ADDRESS(this.createDefaultAddressObject(addressId));

        if (!updated) {
            this.fetchingAddressesError = true;
        } else {
            await this.fetchAddresses();
            this.$router.go(0);
        }
    }

    async fetchAddresses() {
        const fetched: boolean = await this.FETCH_ADDRESSES(this.GET_CLIENT_DATA.id);

        console.log('fetched', fetched);

        if (!fetched) {
            this.defaultAddressError = true;
        }
    }

    async mounted() {
        await this.fetchAddresses();
    }

    modifyFirstStreet(value: any) {
        this.firstStreet = value;
    }
    modifySecondStreet(value: any) {
        this.secondStreet = value;
    }
    modifyCityName(value: any) {
        this.cityName = value;
    }
    modifyState(value: any) {
        this.state = value;
    }
    modifyZipCode(value: any) {
        this.zipCode = value;
    }

    createAddressObject() {
        const address = {
            firstStreet: this.firstStreet,
            secondStreet: this.secondStreet,
            cityName: this.cityName,
            state: this.state,
            zipcode: this.zipCode,
            customer: {
                id: this.GET_CLIENT_DATA.id,
            },
            status: {
                id: STATUS.ACTIVE
            }
        }

        return address;
    }

    async saveChanges() {
        if (this.$refs.form.validate()) {
            const created: boolean = await this.CREATE_ADDRESS(this.createAddressObject());
            console.log('created', created);
            if (!created) {
                this.dialog = false;
                this.addressCreatedError = true;
            } else {
                this.addressCreated = true;
                this.fetchAddresses();
                setTimeout(() => {
                    this.dialog = false;
                }, 2000);
            }
        }
    }

    @authModule.Getter(AuthTypes.getters.GET_CLIENT_DATA) private GET_CLIENT_DATA;
    @addresses.Action(AddressTypes.actions.CREATE_ADDRESS) private CREATE_ADDRESS;

    @addresses.Action(AddressTypes.actions.SHOW_CREATE_ADDRESS_DIALOG) private SHOW_CREATE_ADDRESS_DIALOG;
    @addresses.Action(AddressTypes.actions.SET_DEFAULT_ADDRESS) private SET_DEFAULT_ADDRESS;
    @addresses.Action(AddressTypes.actions.DELETE_ADDRESS) private DELETE_ADDRESS;
    @addresses.Action(AddressTypes.actions.FETCH_ADDRESSES) private FETCH_ADDRESSES;
    @addresses.Getter(AddressTypes.getters.GET_ADDRESSES) private GET_ADDRESSES;

}
</script>

<style scoped>
.dashed-card {
    width: 100%;
    height: 100%;
    border: 2px dashed #979797;
    background: #f5f5f5;
    border-radius: 0;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>