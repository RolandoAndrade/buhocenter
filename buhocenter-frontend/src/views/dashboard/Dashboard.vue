<template>
    <div class="container-page" style="position: relative;">
        <v-row style="min-height: 400px;">
            <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app>
                <v-list dense>
                    <template v-for="item in items">
                        <v-row v-if="item.heading" :key="item.heading" align="center">
                            <v-col cols="6">
                                <v-subheader v-if="item.heading">{{ $t(item.heading) }}</v-subheader>
                            </v-col>
                            <v-col cols="6" class="text-center">
                                <a href="#!" class="body-2 black--text">EDIT</a>
                            </v-col>
                        </v-row>
                        <v-list-group
                            v-else-if="item.children"
                            :key="item.term"
                            v-model="item.model"
                            :prepend-icon="item.model ? item.icon : item['icon-alt']"
                            append-icon
                        >
                            <template v-slot:activator>
                                <v-list-item-content>
                                    <v-list-item-title>{{ $t(item.term) }}</v-list-item-title>
                                </v-list-item-content>
                            </template>
                            <v-list-item v-for="(child, i) in item.children" :key="i" link :to="child.url">
                                <v-list-item-action v-if="child.icon">
                                    <v-icon style="font-size: 18px;">{{ child.icon }}</v-icon>
                                </v-list-item-action>
                                <v-list-item-content>
                                    <v-list-item-title>{{ $t(child.term) }}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list-group>
                        <v-list-item v-else :key="item.term" link :to="item.url">
                            <v-list-item-action>
                                <v-icon style="font-size: 18px;">{{ item.icon }}</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title>{{ $t(item.term) }}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </template>
                </v-list>
            </v-navigation-drawer>
            <v-col>
                <router-view></router-view>
            </v-col>
        </v-row>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { authModule } from '@/store/namespaces';
import AuthMethods from '@/store/auth/methods/auth.methods';
import { ROL } from '@/config/constants';
@Component
export default class Dashboard extends Vue {
    drawer = null;
    items = [
        { icon: 'mdi-contacts', term: 'CLIENTS', url: '/dashboard/clients' },
        { icon: 'fas fa-boxes', term: 'ORDERS', url: '/dashboard/orders' },
        {
            icon: 'mdi-shape',
            term: 'CATEGORIES',
            url: '/dashboard/categories',
        },
        {
            icon: 'fas fa-box',
            term: 'PRODUCTS',
            url: '/dashboard/products',
        },
        {
            icon: 'fas fa-percent',
            term: 'OFFERS',
            url: '/dashboard/promotions/all',
        },

        {
            icon: 'fas fa-cogs',
            term: 'PLATFORM_SETTINGS',
            url: '/dashboard/platform',
        },
        {
            icon: 'mdi-account-group',
            term: 'THIRD_PARTY',
            url: '/dashboard/third-party',
        },
    ];

    mounted() {
        if (this.getClient.role.id !== ROL.ADMIN) {
            this.$router.push('/home');
        }
    }

    @authModule.Getter(AuthMethods.getters.GET_CLIENT_DATA) getClient;
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
