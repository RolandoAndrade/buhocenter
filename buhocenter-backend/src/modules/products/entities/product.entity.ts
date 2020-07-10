import { Entity, Column, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { PrimalEntity } from '../../../app/entities/base-entity';
import { Status } from '../../status/entities/status.entity';
import { Provider } from './provider.entity';
import { Brand } from './brand.entity';
import { ProductDimension } from './product-dimension.entity';
import { ProductRating } from './product-rating.entity';
import { ProductInventory } from './product-inventory.entity';
import { ProductPhoto } from './product-photo.entity';
import { ProductQuestion } from './product-question.entity';
import { ProductCatalogue } from './product-catalogue.entity';
import { Offer } from './offer.entity';
import { Cart } from '../../carts/entities/cart.entity';

@Entity({ name: 'products' })
export class Product extends PrimalEntity {
    @Column({ name: 'name', type: 'text', nullable: false })
    name: string;

    @Column({ name: 'description', type: 'text', nullable: false })
    description: string;

    @Column({ name: 'can_accumulate_points', type: 'boolean', nullable: true })
    canAccumulatePoints: boolean;

    @Column({ name: 'price', type: 'decimal', nullable: false })
    price: number;

    @Column({ name: 'rating', type: 'decimal', nullable: false, default: 0 })
    rating?: number;

    @Column({ name: 'fragile', type: 'boolean', nullable: false })
    fragile: boolean;

    @JoinColumn({ name: 'status_id' })
    @ManyToOne(
        type => Status,
        status => status.products,
        { nullable: false },
    )
    status: Status;

    @JoinColumn({ name: 'brand_id' })
    @ManyToOne(
        type => Brand,
        brand => brand.products,
        { nullable: false },
    )
    brand: Brand;

    @JoinColumn({ name: 'provider_id' })
    @ManyToOne(
        type => Provider,
        provider => provider.products,
        { nullable: false },
    )
    provider: Provider;

    @JoinColumn({ name: 'offer_id' })
    @ManyToOne(
        type => Offer,
        offer => offer.products,
        { nullable: true },
    )
    offer?: Offer;

    @OneToOne(
        type => ProductDimension,
        productDimension => productDimension.product,
        { cascade: true },
    )
    productDimension: ProductDimension;

    @OneToOne(
        type => ProductInventory,
        productInventory => productInventory.product,
        { cascade: true },
    )
    productInventory: ProductInventory;

    @OneToMany(
        type => Cart,
        carts => carts.product,
    )
    carts?: Cart[];

    @OneToMany(
        type => ProductRating,
        productRatings => productRatings.product,
    )
    productRatings?: ProductRating[];

    @OneToMany(
        type => ProductCatalogue,
        productCatalogues => productCatalogues.product,
        { cascade: true },
    )
    productCatalogues: ProductCatalogue[];

    @OneToMany(
        type => ProductPhoto,
        productPhotos => productPhotos.product,
        { cascade: true },
    )
    productPhotos: ProductPhoto[];

    @OneToMany(
        type => ProductQuestion,
        productQuestions => productQuestions.product,
    )
    productQuestions?: ProductQuestion[];
}
