<template>
    <v-container>

        <v-container class="mt-5 d-flex justify-center" style="max-width: none !important;">
            <v-col xs="12" sm="12" lg="6" md="6" class="mt-5">
                <v-card fill-width class="pa-2" style="border: 3px solid #907F46;">
                    <v-row class="d-flex justify-center" fill-width>
                        <h1> Add a new address </h1>
                    </v-row>
                    <v-form ref="form" v-model="isFormValid">
                        <v-row class="mx-auto fill-width">
                            <v-col lg="12" xs="12">
                                <v-text-field
                                    label="First street"
                                    :value="modifiedName"
                                    @change="modifyFirstStreet"
                                    :rules="[
                                        rules.required(),
                                        rules.fieldLength(65500),
                                    ]"
                                ></v-text-field>
                            </v-col>
                            <v-col lg="12" xs="12">
                                <v-text-field
                                    label="Second street"
                                    @change="modifySecondStreet"
                                    :value="secondStreet"
                                    :rules="[rules.fieldMaxLength(65500)]"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row class="mx-auto fill-width">
                            <v-col cols="12">
                                <v-text-field label="City" 
                                    :value="cityName"
                                    :rules="[rules.required(), rules.fieldLength(65500)]"
                                    @change="modifyCityName"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row class="mx-auto fill-width">
                            <v-col cols="12">
                                <v-text-field label="State" 
                                    :value="state"
                                    :rules="[rules.required(), rules.fieldLength(65500)]"
                                    @change="modifyState"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row class="mx-auto fill-width">
                            <v-col cols="12">
                                <v-text-field label="Zip Code" 
                                    :value="zipCode"
                                    :rules="[rules.fieldMaxLength(65500)]"
                                    @change="modifyZipCode"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-form>
                    <v-row class="d-flex justify-center my-2" @click="saveChanges()">
                        <v-btn :loading="loading" outlined color="primary">SAVE</v-btn>
                    </v-row>
                </v-card>
            </v-col>
        </v-container>
        <v-snackbar v-model="addressCreated" top :timeout="timeout" color="success">
            La dirección fue registrada exitosamente
            <v-btn color="white" text @click="addressCreated = false">Cerrar</v-btn>
        </v-snackbar>
        <v-snackbar v-model="addressCreatedError" top :timeout="timeout" color="error">
            Ocurrió un error creando la dirección del usuario
            <v-btn color="white" text @click="addressCreatedError = false">Cerrar</v-btn>
        </v-snackbar>
    </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { addresses, authModule } from "../../../store/namespaces";
import AuthTypes from '../../../store/auth-module/methods/auth-methods';
import AddressTypes from '@/store/addresses/methods/address-methods';
import rules from '../../../utils/rules';
import { STATUS } from '../../../config/constants';

@Component
export default class CreateAddressForm extends Vue {
    timeout: number = 5000;
    isFormValid: boolean = true;
    addressCreated: boolean = false;
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

            if (!created) {
                this.addressCreatedError = true;
            } else {
                this.addressCreated = true;
                setTimeout(() => {
                    this.$router.push({ name: 'home' });
                }, 5000);
            }
        }
    }

    @authModule.Getter(AuthTypes.getters.GET_CLIENT_DATA) private GET_CLIENT_DATA;
    @addresses.Action(AddressTypes.actions.CREATE_ADDRESS) private CREATE_ADDRESS;
}
</script>