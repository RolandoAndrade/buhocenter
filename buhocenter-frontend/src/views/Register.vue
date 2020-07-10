<template>
    <v-content class="register-container">
        <v-container class="fill-height" fluid>
            <FormRegister></FormRegister>
        </v-container>
    </v-content>
</template>

<script>
import FormRegister from '@/modules/client/auth/components/FormRegister';

export default {
    name: 'Register',
    components: {
        FormRegister,
    },
};
</script>
<style scoped>
.register-container {
    padding: 20px 0px !important;
}
</style>
