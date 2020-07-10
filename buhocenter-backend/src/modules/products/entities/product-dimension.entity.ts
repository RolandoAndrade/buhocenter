import { Entity, Column, JoinColumn, OneToOne } from 'typeorm';
import { PrimalEntity } from '../../../app/entities/base-entity';
import { Product } from './product.entity';

@Entity({ name: 'product_dimensions' })
export class ProductDimension extends PrimalEntity {
    @Column({ name: 'width', type: 'numeric', nullable: false })
    width: string;

    @Column({ name: 'height', type: 'numeric', nullable: false })
    height: string;

    @Column({ name: 'long', type: 'numeric', nullable: false })
    long: string;

    @Column({ name: 'weight', type: 'numeric', nullable: false })
    weight: string;

    @JoinColumn({ name: 'product_id' })
    @OneToOne(
        type => Product,
        product => product.productDimension,
        { nullable: false, onUpdate: 'CASCADE' },
    )
    product: Product;
}
