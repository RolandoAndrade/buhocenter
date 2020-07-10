import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PrimalEntity } from '../../../app/entities/base-entity';
import { Product } from './product.entity';

@Entity({ name: 'product_photos' })
export class ProductPhoto extends PrimalEntity {
    @Column({ name: 'content', type: 'varchar', length: 100, nullable: false })
    content: string;

    @JoinColumn({ name: 'product_id' })
    @ManyToOne(
        type => Product,
        product => product.productPhotos,
        { nullable: false, onUpdate: 'CASCADE' },
    )
    product: Product;
}
