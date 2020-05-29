import { Entity, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '../../app/entities/base-entity';
import { Product } from './product.entity';

@Entity({ name: 'product_dimension' })
export class ProductDimension extends BaseEntity {
	
	@Column({ name: 'width', type: 'varchar', length: 100, nullable: false })
	width: string;

	@Column({ name: 'height', type: 'varchar', length: 100, nullable: false })
	height: string;

	@Column({ name: 'long', type: 'varchar', length: 100, nullable: false })
	long: string;

	@JoinColumn({ name: 'product_id' })
	@OneToOne(type => Product, product => product.productDimensions)
	product: Product;
}
