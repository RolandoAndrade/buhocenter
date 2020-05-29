import { Entity, Column, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from '../../app/entities/base-entity';
import { Product } from './product.entity';

@Entity({ name: 'brand' })
export class Brand extends BaseEntity {
	
	@Column({ name: 'name', type: 'varchar', length: 100, nullable: false })
	name: string;
	
	@OneToMany(type => Product, products => products.brand)
	products: Product[];
}
