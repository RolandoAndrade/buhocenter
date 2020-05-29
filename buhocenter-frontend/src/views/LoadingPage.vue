<template>
    <v-container>
        <v-row class="mt-12 pt-4">
            <v-col offset="4" cols="4">
                <v-img src="../assets/Logo-completo.png" width="400" class="img-header-form"></v-img>
            </v-col>
        </v-row>
        <v-col>
            <v-col offset="2" cols="8">
                <v-progress-linear
                        indeterminate
                        primary
                ></v-progress-linear>
            </v-col>
        </v-col>
    </v-container>
</template>

<script lang="ts">
    import {Component, Vue} from "vue-property-decorator";
    @Component({})
    export default class LoadingPage extends Vue {
    }
</script>

<style>


</style>
