<template>
    <v-container>
        <v-row>
            <v-col class="d-flex justify-center">
                <h2>{{ $t('CLIENTS') }}</h2>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-card>
                    <v-card-title>
                        <v-spacer></v-spacer>
                        <v-text-field
                            v-model="search"
                            append-icon="mdi-magnify"
                            label=""
                            single-line
                            hide-details
                        ></v-text-field>
                    </v-card-title>
                    <v-data-table
                        :headers="headers"
                        :items="desserts"
                        :expanded.sync="expanded"
                        item-key="name"
                        class="elevation-1"
                        :search="search"
                    >
                        <template v-slot:item.actions="{ item }">
                            <v-icon
                                color="red"
                                small
                                @click="setMessage(item, 'Are you sure you want to block this user?', 1)"
                                class="mr-2"
                            >
                                mdi-block-helper
                            </v-icon>
                            <v-icon
                                color="green"
                                small
                                @click="setMessage(item, 'Are you sure you want to unblock this user?', 2)"
                            >
                                mdi-checkbox-marked-circle-outline
                            </v-icon>
                        </template>
                    </v-data-table>
                </v-card>
            </v-col>
        </v-row>
        <v-dialog v-model="dialog" max-width="290">
            <v-card>
                <v-card-text class="pa-2">{{ message }}</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="error darken-1" text @click="confirm(false)">No</v-btn>
                    <v-btn color="green darken-1" text @click="confirm(true)">Yes</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ClientInterface } from '../interfaces/clients.interface';
import { clientsModule } from '@/store/namespaces';
import ClientMethods from '@/store/clients/methods/clients.methods';

@Component
export default class DashboardClients extends Vue {
    expanded = [];
    search = '';
    headers = [
        {
            text: 'Name',
            align: 'start',
            sortable: false,
            value: 'name',
        },
        { text: 'LastName', value: 'lastName', sortable: false },
        { text: 'BirthDate', value: 'birthdate', sortable: false },
        { text: 'Email', value: 'email', sortable: false },
        { text: 'Role', value: 'role.name', sortable: false },
        { text: 'Status', value: 'status.name', sortable: false },
        { text: 'Actions', value: 'actions', sortable: false },
    ];
    desserts: ClientInterface[] = [];
    dialog = false;
    message = '';
    user?: ClientInterface;
    type?: number;
    setMessage(client: ClientInterface, message: string, type: number) {
        this.message = message;
        this.dialog = true;
        this.user = client;
        this.type = type;
    }

    confirm(confirm: boolean) {
        this.dialog = false;
        if (confirm && this.type === 1) this.blockUser(this.user!);
        else if (confirm && this.type === 2) this.unblockUser(this.user!);
    }

    blockUser(client: ClientInterface): void {
        const status = {
            createdAt: client.status?.createdAt,
            description: client.status?.description,
            id: 2,
            name: 'Inactive',
            updatedAt: Number(new Date()),
        };
        client.status = status;
        this.blockAndUblockClients(client);
    }

    unblockUser(client: ClientInterface): void {
        const status = {
            createdAt: client.status?.createdAt,
            description: client.status?.description,
            id: 1,
            name: 'Active',
            updatedAt: Number(new Date()),
        };
        client.status = status;
        this.blockAndUblockClients(client);
    }

    async fetchAllClients(): Promise<void> {
        await this.fetchClients();
        this.desserts = this.splitDate(this.getClients);
    }

    splitDate(clients: ClientInterface[]): ClientInterface[] {
        var clientes = clients;
        clientes.forEach((client: ClientInterface) => {
            client.birthdate = client.birthdate?.slice(0, 10);
        });
        return clientes;
    }

    mounted(): void {
        this.fetchAllClients();
    }

    @clientsModule.Action(ClientMethods.actions.GET_ALL_CLIENTS) fetchClients!: () => boolean;
    @clientsModule.Action(ClientMethods.actions.BLOCK_AND_UNBLOCK_CLIENTS) blockAndUblockClients!: (
        Client: ClientInterface,
    ) => boolean;
    @clientsModule.Getter(ClientMethods.getters.GET_CLIENTS) getClients!: ClientInterface[];
}
</script>
<style>
.container-page {
    position: relative;
    width: 100%;
    padding: 0;
}
.v-image__image--contain {
    background-position-y: 38% !important;
}

@media only screen and (max-width: 600px) {
    .v-window__prev,
    .v-window__next {
        top: calc(40% - 20px) !important;
    }
}
</style>
