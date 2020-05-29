import { Entity,Column,ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../app/entities/base-entity';
import { Product } from './product.entity';

@Entity({ name: 'product_photo' }) 
export class ProductPhoto extends BaseEntity {
	@Column({ name: 'content', type: 'varchar', length: 100, nullable: false })
	content: string;

	@JoinColumn({ name: 'product_id' })
	@ManyToOne(type => Product, product => product.photos)
	product: Product;
}
