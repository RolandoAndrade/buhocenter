<template>
    <v-col cols="12" lg="6" md="6" sm="12" xs="12">
        <router-link :to="'/' + link">
            <div class="logo-container">
                <img :src="src" class="logo-image" />
                <div class="logo-name">
                    {{ name }}
                </div>
            </div>
        </router-link>
    </v-col>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({})
export default class Card extends Vue {
    @Prop() src?: string;
    @Prop() name?: string;
    @Prop() link!: string;
}
</script>

<style lang="scss">
.heading-secondary {
    margin: 0 auto;
    font-family: 'Lato', sans-serif;
    font-weight: 400;
    text-align: center;
    line-height: 1.7;
    font-size: 30px;
    text-transform: uppercase;
    font-weight: 700;
    display: inline-block;
    background-image: linear-gradient(to right, #907f46, #cab776);
    -webkit-background-clip: text;
    color: transparent;
    letter-spacing: 0.2rem;

    transition: all 0.2s;

    &:hover {
        transform: skewY(2deg) skewX(15deg) scale(1.1);
        text-shadow: 0.5rem 1rem 2rem #6b6b6b5b;
    }
}

.logo-container {
    width: 300px;
    cursor: pointer;
    margin: 0 auto;
    text-align: center;
    transition: all 0.4s;

    &:hover {
        transform: translateY(1px) scale(1.05);
    }
}
.logo-image {
    width: 100%;
    box-shadow: 0 30px 60px rgba(black, 0.2);
    background-image: linear-gradient(rgba(0, 0, 0, 0.452), rgba(0, 0, 0, 0.452));
}

.logo-name {
    box-shadow: 0 5px 15px rgba(black, 0.2);
    border-radius: 5px;
    color: white;
    background-color: #cab676;
    padding: 10px;
    width: 60%;
    position: relative;
    text-align: center;
    top: -5px;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>
