import { Entity, Column, OneToMany } from 'typeorm';
import { PrimalEntity } from '../../../app/entities/base-entity';
import { Product } from './product.entity';

@Entity({ name: 'providers' })
export class Provider extends PrimalEntity {
    @Column({ name: 'name', type: 'varchar', length: 100, nullable: false })
    name: string;

    @OneToMany(
        type => Product,
        products => products.provider,
    )
    products: Product[];
}
