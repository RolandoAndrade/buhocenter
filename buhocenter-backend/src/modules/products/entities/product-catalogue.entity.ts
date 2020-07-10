import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { PrimalEntity } from '../../../app/entities/base-entity';
import { Catalogue } from './catalogue.entity';
import { Product } from './product.entity';

@Entity({ name: 'product_catalogues' })
export class ProductCatalogue extends PrimalEntity {
    @JoinColumn({ name: 'catalogue_id' })
    @ManyToOne(
        type => Catalogue,
        catalogue => catalogue.productCatalogues,
        { nullable: false },
    )
    catalogue: Catalogue;

    @JoinColumn({ name: 'product_id' })
    @ManyToOne(
        type => Product,
        product => product.productCatalogues,
        { nullable: false, onUpdate: 'CASCADE' },
    )
    product: Product;
}
