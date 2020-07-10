<template>
    <v-container fluid style="background: #f4f4f4; height: 450px; position: relative;">
        <v-img src="../../../../assets/images/catalogo.jpg" height="125" class="grey darken-4"></v-img>
        <v-list rounded style="padding: 30px 0px;">
            <h2 style="margin-left: 80px;" class="title">{{ $t('CATALOGUES') }}</h2>
            <v-row style="padding-left: 70px; padding-right: 80px;">
                <EmptyState v-if="this.GET_CATALOGUES.length == 0" :message="emptyMessage" />
                <v-col cols="12" lg="3" md="4" sm="6" xs="12" v-for="(item, i) in GET_CATALOGUES" :key="i">
                    <a href="#" class="link-router-catalogue" @click="setCatalogue(item)">
                        <v-row class="list-item-catalogue">
                            <v-col cols="1">
                                <v-icon class="icon-catalogue">fas fa-circle</v-icon>
                            </v-col>
                            <v-col cols="10">
                                <v-list-item-title> {{ $t(item.term) }}</v-list-item-title>
                            </v-col>
                        </v-row>
                    </a>
                </v-col>
            </v-row>
        </v-list>
    </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { catalogueModule, layout } from '@/store/namespaces';
import CatalogueMethods from '@/store/catalogue/methods/catalogue.methods';
import LayoutTypes from '@/store/layout/methods/layout.methods';
import { Catalogues as CataloguesInterface } from '../interfaces/catalogues.interface';
import { Catalogue } from '../interfaces/catalogues.interface';
import EmptyState from '@/modules/common/components/EmptyState.vue';

@Component({
    components: {
        EmptyState,
    },
})
export default class Catalogues extends Vue {
    emptyMessage = 'NO_CATALOGUES';

    async fetchCatalogues(id) {
        await this.FETCH_CATALOGUES(id);
    }

    setCatalogue(catalogue: Catalogue) {
        this.MODIFY_CATALOGUE(catalogue);
        this.$router.push(`/products?category_id=${this.get_categoryId()}&catalogue_id=${catalogue.id}`);
    }

    async mounted() {
        if (this.$route.query.category_id) {
            await this.fetchCatalogues(this.$route.query.category_id);
        }
    }

    get_categoryId() {
        if (this.$route.query.category_id) {
            return this.$route.query.category_id;
        }
        return '';
    }

    @catalogueModule.Action(CatalogueMethods.actions.FETCH_CATALOGUES)
    FETCH_CATALOGUES!: (categoryId: string) => boolean;
    @catalogueModule.Getter(CatalogueMethods.getters.GET_CATALOGUES)
    GET_CATALOGUES!: CataloguesInterface;

    @layout.Action(LayoutTypes.actions.MODIFY_CATALOGUE) MODIFY_CATALOGUE!: (catalogue: Catalogue) => void;
}
</script>

<style>
.icon-catalogue {
    font-size: 14px !important;
}

.list-item-catalogue {
    border-radius: 2px;
}

.list-item-catalogue:hover div,
.list-item-catalogue:hover,
.list-item-catalogue:hover i {
    background: #907f46;
    color: #ffffff !important;
}

.link-router-catalogue {
    text-decoration: none !important;
}
</style>
