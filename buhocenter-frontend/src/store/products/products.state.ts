import { ProductStateInterface } from './interfaces/products.state.interface';

export const PRODUCT_EMPTY_STATE: ProductStateInterface = {
    products: [],
    allProducts: [],
    productsAndPhotosLoaded: false,
    productsDaily: [],
    productsDailyAndPhotosLoaded: false,
    totalProducts: 0,
    itemDetail: {
        productPhotos: [],
        provider: {
            createdAt: '',
            id: 0,
            name: '',
            updatedAt: '',
        },
        productDimension: {
            width: '',
            height: '',
            long: '',
            weight: '',
        },
        rating: '',
    },
};
