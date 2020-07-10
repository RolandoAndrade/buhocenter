<template>
    <v-content class="auth-container">
        <v-container class="fill-height" fluid>
            <Login></Login>
        </v-container>
    </v-content>
</template>

<script>
// @ is an alias to /src
import Login from '@/modules/client/auth/components/Login';

export default {
    name: 'Auth',
    components: {
        Login,
    },
};
</script>

<style scoped>
.auth-container {
    padding: 20px 0px !important;
}
</style>
