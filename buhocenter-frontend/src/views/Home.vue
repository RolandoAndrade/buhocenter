<template>
    <div class="container-page">
        <v-carousel hide-delimiters height="300">
            <v-carousel-item
                class="carrousel-home"
                v-for="(item, i) in items"
                :key="i"
                :src="item.src"
            ></v-carousel-item>
        </v-carousel>
        <Categories></Categories>
        <DailyRecomendation></DailyRecomendation>
        <AboutUs></AboutUs>
        <Allies></Allies>
        <v-snackbar v-model="paymentSuccess" top color="success" class="mt-12">
            {{ $t('PAYMENT_SUCCESS') }}
            <v-btn color="white" text @click="paymentSuccess = false">{{ $t('CLOSE') }}</v-btn>
        </v-snackbar>
        <v-snackbar v-model="paymentError" top color="error" class="mt-12">
            {{ $t('PAYMENT_CANCELED') }}
            <v-btn color="white" text @click="paymentError = false">{{ $t('CLOSE') }}</v-btn>
        </v-snackbar>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Categories from '@/modules/client/categories/components/Categories.vue';
import AboutUs from '@/modules/client/about-us/components/AboutUs.vue';
import DailyRecomendation from '@/modules/client/daily-recomendation/components/DailyRecomendation.vue';
import Allies from '@/modules/client/allies/components/Allies.vue';
@Component({
    components: { Categories, AboutUs, DailyRecomendation, Allies },
})
export default class Home extends Vue {
    items = [
        {
            src: require('../assets/images/slider-1.jpg'),
        },
        {
            src: require('../assets/images/slider-2.jpg'),
        },
        {
            src: require('../assets/images/slider-4.jpg'),
        },
    ];
    paymentSuccess: boolean = false;
    paymentError: boolean = false;

    mounted() {
        const query = this.$route.query;
        if (query.hasOwnProperty('success')) {
            if (query.success === 'true') {
                this.paymentSuccess = true;
            } else {
                this.paymentError = true;
            }
        }
    }
}
</script>
<style>
.container-page {
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
