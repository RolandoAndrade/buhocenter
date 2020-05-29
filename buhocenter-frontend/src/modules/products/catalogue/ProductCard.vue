<template>
  <div>
      <v-row>
          <v-col cols="12" lg="4" md="6" sm="12" v-for="(item) in GET_PRODUCTS" :key="item.id" class="mb-4 contenedor-product">
              <v-card class="d-inline-block" style="width: 100%" v-if="GET_PRODUCTS_AND_PHOTOS_LOADED">
                  <v-container>
                      <v-row justify="center" style="height: 520px">
                          <v-col cols="12">
                              <v-img
                                      height="200"
                                      contain
                                      :src="item.imageUrl"
                              ></v-img>
                          </v-col>
                          <v-col
                                  cols="9"
                                  class="pl-0 pb-0"
                          >
                              <v-row
                                      class="flex-column ma-0 fill-height caption"
                                      justify="center"
                              >
                                  <p>{{$t('BY')}} <b>{{ getProvider(item) }}</b></p>
                              </v-row>
                          </v-col>

                          <v-col
                                  cols="9"
                                  class="pl-0 product-name"
                                  @click="getItemDetail(item)"
                          >
                              <v-row
                                      class="flex-column ma-0 fill-height caption"
                                      justify="center"
                              >
                                  {{ item.name }}
                              </v-row>
                          </v-col>

                          <v-col
                                  cols="9"
                                  class="pl-0 pb-0"
                          >
                              <v-row
                                      class="flex-column ma-0 fill-height title"
                                      justify="center"
                              >
                                  ${{ item.price }}
                              </v-row>
                          </v-col>

                          <v-col
                                  cols="9"
                                  class="pl-0"
                          >
                              <v-row
                                      class="flex-column ma-0 fill-height title ml-0 mr-0"
                                      justify="center"
                              >
                                  <v-rating
                                          :value="getRating(item.productRatings)"
                                          background-color="orange lighten-3"
                                          color="primary"
                                          :small="$vuetify.breakpoint.mdAndUp"
                                          :x-small="$vuetify.breakpoint.mdAndDown"
                                          readonly
                                          :size="$vuetify.breakpoint.mdAndDown ? '3' : '30'"
                                          :dense="$vuetify.breakpoint.mdAndDown"
                                          half-increments
                                  ></v-rating>
                              </v-row>
                          </v-col>
                      </v-row>
                  </v-container>
              </v-card>
          </v-col>
      </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { products } from "../../../store/namespaces";
import {
    GET_PRODUCTS,
    GET_PRODUCTS_AND_PHOTOS_LOADED,
} from '../../../store/products/methods/products.getters';
import {
    FETCH_PRODUCTS,
    FETCH_PRODUCT_PHOTO_BY_NAME,
    SET_PRODUCT_PHOTOS_NOT_LOADED,
    FETCH_PRODUCT_DETAIL,
    FETCH_SERVICE_DETAIL,
} from '../../../store/products/methods/products.actions';
import { ITEM_TYPE } from '../../../config/constants';

@Component
export default class ProductCard extends Vue {
    contentLoaded: boolean = false;

    getItemDetail(item): void {
        if (item.type === ITEM_TYPE.PRODUCT) {
            this.$router.push({ name: 'item-detail', query: { item: 'product', id: item.id } })
        } else {
            this.$router.push({ name: 'item-detail', query: { item: 'service', id: item.id } })
        }
    }

    getProvider(item): string {
        if (item.type === ITEM_TYPE.PRODUCT) {
            return item.productProvider[0].provider.name;
        }

        return item.serviceProvider[0].provider.name;
    }

    getRating(productRatings): number {
        return productRatings[0] ? productRatings[0].rating : 0;
    }

    @products.Action(FETCH_SERVICE_DETAIL) FETCH_SERVICE_DETAIL;
    @products.Action(FETCH_PRODUCT_DETAIL) FETCH_PRODUCT_DETAIL;
    @products.Getter(GET_PRODUCTS) GET_PRODUCTS;
    @products.Getter(GET_PRODUCTS_AND_PHOTOS_LOADED) GET_PRODUCTS_AND_PHOTOS_LOADED;
}
</script>
<style scoped lang="scss">
    .pointer {
        cursor: pointer;
    }
    .fade-move {
      transition: transform 1s;
    }
    .card {
      transition: 500ms;
      position: relative;
      overflow: hidden;
    }
    .card img {
      z-index: 1;
    }
    .card button {
      width: 140px;
      margin-bottom: 10px;
    }
    .card:hover img {
      filter: blur(4px);
    }
    .card:hover .overlay {
      opacity: 0.8;

    }
    .card .overlay {
      position: absolute;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 70%;
      background-color: #232b34;
      opacity: 0;
      z-index: 100;
      transition: all 0.3s ease-in;
    }
    .card:hover, .card:active {
      transform: scaleY(1.1) scaleX(1.06);
      box-shadow: 0 14px 98px rgba(0, 0, 0, 0.25), 0 0px 60px rgba(0, 0, 0, 0.22);
    }
    .product-name{
        cursor: pointer;
    }

    .product-name:hover{
        text-decoration: underline;
        color: #907F46;
    }


    @media only screen and (max-width: 768px) {
        .contenedor-product{
            max-height: 500px;
        }
    }
</style>
