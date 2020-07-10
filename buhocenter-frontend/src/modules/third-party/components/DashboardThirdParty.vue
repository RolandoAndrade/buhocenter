<template>
    <v-container>
        <v-row justify="center">
            <div style="display: flex; align-items: center; margin: 0 auto;">
                <h2>Notificate orders to PetroMiles</h2>
                <img class="ml-2" src="@/assets/petromiles.png" style="width: 50px; height: 50px;" />
            </div>
        </v-row>
        <v-divider></v-divider>
        <v-row justify="center" class="mt-6">
            <v-btn color="primary" dark class="mt-6" @click="() => downloadCsv()"
                >Notificate and download Csv</v-btn
            >
            <v-snackbar v-model="errorDownloading" top color="success" class="mt-12">
                There are no updates!
                <v-btn color="white" text @click="errorDownloading = false">{{ $t('CLOSE') }}</v-btn>
            </v-snackbar>
        </v-row>
    </v-container>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { thirdParty } from '@/store/namespaces';
import ThirdPartyTypes from '@/store/third-party/methods/third-party.methods';

@Component
export default class DashboardThirdParty extends Vue {
    errorDownloading = false;

    async downloadCsv() {
        let isANewFile: boolean = await this.generateCsv();
        if (!isANewFile) {
            this.errorDownloading = true;
        }
    }

    @thirdParty.Action(ThirdPartyTypes.actions.GENERATE_CSV) generateCsv!: () => boolean;
}
</script>
<style></style>
