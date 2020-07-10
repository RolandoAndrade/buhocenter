import { Entity, Column, JoinColumn, OneToMany } from 'typeorm';
import { PrimalEntity } from '../../../app/entities/base-entity';
import { Product } from './product.entity';

@Entity({ name: 'brands' })
export class Brand extends PrimalEntity {
    @Column({ name: 'name', type: 'varchar', length: 100, nullable: false })
    name: string;

    @OneToMany(
        type => Product,
        products => products.brand,
    )
    products: Product[];
}
