<template>
    <v-content>
        <v-container
                class="fill-height"
                fluid
        >
            <FormRegister></FormRegister>
        </v-container>
    </v-content>
</template>

<script>
    import FormRegister from "@/modules/auth-module/components/FormRegister";

    export default {
        name: 'Register',
        components: {
            FormRegister
        }
    }
</script>
