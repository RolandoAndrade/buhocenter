<template>
    <v-container fluid class="mt-5" style="max-width: none !important;">
        <v-img src="../../../../assets/images/profile.jpg" height="125" class="grey darken-4"></v-img>
        <v-row class="d-flex align-center mt-6">
            <v-col cols="2">
                <v-btn icon @click="goToProfile()">
                    <v-icon large color="primary">
                        mdi-arrow-left
                    </v-icon>
                </v-btn>
            </v-col>
            <v-col>
                <div class="title-2">
                    {{ $t('MY_PROFILE') }}
                    <div class="line"></div>
                </div>
            </v-col>
            <v-col cols="2"></v-col>
        </v-row>
        <v-container class="d-flex justify-center" style="max-width: none !important;">
            <v-col xs="12" sm="12" lg="6" md="6">
                <v-card fill-width class="pa-2">
                    <v-row class="d-flex justify-center pa-2 mb-3" fill-width>
                        <v-icon style="font-size: 25px;">fas fa-user</v-icon>
                    </v-row>

                    <v-form ref="form" v-model="isFormValid">
                        <v-row class="mx-auto fill-width">
                            <v-col lg="6" xs="12">
                                <v-text-field
                                    :label="$t('FIRST-NAME')"
                                    @change="modifyName"
                                    :value="modifiedName"
                                    :rules="[rules.required(), rules.fieldLength(100)]"
                                ></v-text-field>
                            </v-col>
                            <v-col lg="6" xs="12">
                                <v-text-field
                                    :label="$t('LAST-NAME')"
                                    @change="modifyLastName"
                                    :value="modifiedLastName"
                                    :rules="[rules.required(), rules.fieldLength(100)]"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row class="mx-auto fill-width">
                            <v-col cols="6" v-if="!GET_CLIENT_DATA.is_federate">
                                <v-text-field
                                    :label="$t('EMAIL')"
                                    :value="modifiedEmail"
                                    :rules="[rules.validateEmail(modifiedEmail)]"
                                    @change="modifyEmail"
                                ></v-text-field>
                            </v-col>
                            <v-col :cols="!GET_CLIENT_DATA.is_federate ? '6' : '12'">
                                <v-text-field
                                    :label="$t('CELLPHONE')"
                                    v-model="modifiedCellphone"
                                    v-mask="'+1 (###) ###-####'"
                                    :rules="[rules.required()]"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row v-if="!this.GET_CLIENT_DATA.is_federate" class="mx-auto fill-width">
                            <v-col lg="6" xs="12">
                                <v-text-field
                                    :value="password"
                                    @change="modifyPsswd"
                                    :rules="[rules.required(), rules.minPsswdLength()]"
                                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                    :type="showPassword ? 'text' : 'password'"
                                    label="Password"
                                    @click:append="showPassword = !showPassword"
                                    required
                                ></v-text-field>
                            </v-col>
                            <v-col lg="6" xs="12">
                                <v-text-field
                                    :value="confirmedPassword"
                                    @change="modifyConfirmedPsswd"
                                    :rules="[
                                        rules.required(),
                                        rules.minPsswdLength(),
                                        rules.matchPsswd(password, confirmedPassword),
                                    ]"
                                    :append-icon="showConfirmedPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                    :type="showConfirmedPassword ? 'text' : 'password'"
                                    label="Confirm Password"
                                    @click:append="showConfirmedPassword = !showConfirmedPassword"
                                    required
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        <v-row class="mx-auto pointer pa-3">
                            <v-col
                                cols="6"
                                v-for="(item, i) in GET_LANGUAGES"
                                :key="i"
                                @click="selectCustomerLanguage(item.code)"
                                :style="
                                    modifiedLanguage === item.code
                                        ? 'border: 2px solid #907F46; border-radius:10px;'
                                        : 'border: 2px solid transparent; border-radius:10px;'
                                "
                            >
                                <v-img
                                    class="d-flex justify-center mb-4"
                                    style="margin-left: 46%;"
                                    :src="require(`../../../../assets/flags/${item.code}.png`)"
                                    height="18"
                                    width="18"
                                ></v-img>

                                <v-row class="pa-0 ma-0 text-center d-flex justify-center">{{
                                    item.name
                                }}</v-row>
                            </v-col>
                        </v-row>
                    </v-form>
                    <v-row class="d-flex justify-center my-2 mb-4" @click="saveChanges()">
                        <v-btn :loading="loading" outlined color="primary">{{ $t('SAVE') }}</v-btn>
                    </v-row>
                </v-card>
            </v-col>
        </v-container>
        <v-snackbar v-model="userProfileModified" top :timeout="timeout" color="success">
            Su perfil de usuario fue modificado exitosamente
            <v-btn color="white" text @click="userProfileModified = false">Cerrar</v-btn>
        </v-snackbar>
        <v-snackbar v-model="userProfileError" top :timeout="timeout" color="error">
            Ocurrió un error modificando la información del usuario
            <v-btn color="white" text @click="userProfileError = false">Cerrar</v-btn>
        </v-snackbar>
        <v-snackbar v-model="loadingProfileError" top :timeout="timeout" color="error">
            Ocurrió un error obteniendo la información del perfil del usuario
            <v-btn color="white" text @click="loadingProfileError = false">Cerrar</v-btn>
        </v-snackbar>
    </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { authModule, languageModule } from '../../../../store/namespaces';
import AuthTypes from '../../../../store/auth/methods/auth.methods';
import LanguageTypes from '../../../../store/languages/methods/language.methods';
import LanguageMethods from '../../../../store/languages/methods/language.methods';
import rules from '../../../../utils/rules';
import { CustomerInterface } from '@/modules/client/auth/interfaces/customer.interface';

@Component
export default class PersonalInformation extends Vue {
    timeout = 5000;
    isFormValid = true;
    userProfileModified = false;
    userProfileError = false;
    loadingProfileError = false;
    loading = false;

    modifiedName = '';
    modifiedLastName = '';
    modifiedEmail = '';
    modifiedLanguage = '';
    modifiedCellphone = '';
    password = '';
    confirmedPassword = '';

    showPassword = false;
    showConfirmedPassword = false;

    rules: any = rules;

    $refs!: {
        form: any;
    };

    modifyName(value: string): void {
        this.modifiedName = value;
    }

    modifyLastName(value: string): void {
        this.modifiedLastName = value;
    }

    modifyEmail(value: string): void {
        this.modifiedEmail = value;
    }

    modifyPsswd(value: string): void {
        this.password = value;
    }

    modifyConfirmedPsswd(value: string): void {
        this.confirmedPassword = value;
    }

    modifyCellphone(value: string): void {
        this.modifiedCellphone = value;
    }

    goToProfile(): void {
        this.$router.push('/profile');
    }

    selectCustomerLanguage(code: string): void {
        this.modifiedLanguage = code;
    }

    private createClientDataObject(): CustomerInterface {
        return {
            id: this.GET_CLIENT_DATA.id,
            birthDate: this.GET_CLIENT_DATA.birthdate,
            email: this.modifiedEmail,
            is_federate: this.GET_CLIENT_DATA.is_federate,
            cellphone: this.modifiedCellphone,
            language: this.modifiedLanguage,
            name: this.modifiedName,
            lastName: this.modifiedLastName,
            uid: this.GET_CLIENT_DATA.uid,
            role: this.GET_CLIENT_DATA.role,
        };
    }

    async saveChanges(): Promise<void> {
        if (this.$refs.form.validate()) {
            this.loading = true;

            let updatedInFirebase = true;

            if (!this.GET_CLIENT_DATA.is_federate!) {
                updatedInFirebase = await this.UPDATE_CREDENTIALS({
                    email: this.modifiedEmail,
                    psswd: this.password,
                });
            }

            if (!updatedInFirebase) {
                this.userProfileError = true;
            } else {
                const updated: boolean = await this.UPDATE_CUSTOMER(this.createClientDataObject());

                if (!updated) {
                    this.userProfileError = true;
                } else {
                    this.MODIFY_CLIENT_DATA(this.createClientDataObject());
                    this.API_CHANGE_LANGUAGE(this.modifiedLanguage);
                    this.userProfileModified = true;
                    this.$router.push('/profile');
                }
            }

            this.loading = false;
        }
    }

    async mounted() {
        this.modifiedName = this.GET_CLIENT_DATA.name!;
        this.modifiedLastName = this.GET_CLIENT_DATA.lastName!;
        this.modifiedLanguage = this.GET_CLIENT_DATA.language!;
        this.modifiedEmail = this.GET_CLIENT_DATA.email!;
        this.modifiedCellphone = this.GET_CLIENT_DATA.cellphone!;
    }

    @languageModule.Getter(LanguageMethods.getters.GET_PLATFORM_LANGUAGE)
    private PLATFORM_LANGUAGE!: string;
    @languageModule.Getter(LanguageMethods.getters.GET_LANGUAGES)
    private GET_LANGUAGES;
    @languageModule.Action(LanguageTypes.actions.API_GET_LANGUAGES)
    private API_GET_LANGUAGES!: () => boolean;
    @languageModule.Action(LanguageTypes.actions.API_CHANGE_LANGUAGE)
    private API_CHANGE_LANGUAGE!: (code: string) => boolean;
    @authModule.Action(AuthTypes.actions.UPDATE_CREDENTIALS)
    private UPDATE_CREDENTIALS!: (credentials: { email: string; psswd: string }) => boolean;
    @authModule.Action(AuthTypes.actions.UPDATE_CUSTOMER)
    private UPDATE_CUSTOMER!: (data: CustomerInterface) => boolean;
    @authModule.Action(AuthTypes.actions.MODIFY_CLIENT_DATA)
    private MODIFY_CLIENT_DATA!: (data: CustomerInterface) => void;
    @authModule.Getter(AuthTypes.getters.GET_CLIENT_DATA)
    private GET_CLIENT_DATA!: CustomerInterface;
}
</script>
<style scoped>
.pointer {
    cursor: pointer;
}
</style>
