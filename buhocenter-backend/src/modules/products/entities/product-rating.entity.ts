import { Entity,Column, ManyToOne, JoinColumn} from 'typeorm';
import { BaseEntity } from '../../app/entities/base-entity';
import { Product } from './product.entity';
import { Customer } from '../../users/entities/customer.entity';

@Entity({ name: 'product_rating' }) 
export class ProductRating extends BaseEntity {
	@Column({ name: 'rating', type: 'integer', nullable: true })
	rating: number;

	@Column({ name: 'comment', type: 'text', nullable: true })
	comment: string;

	@Column({ name: 'date', nullable: true })
	date: Date;	

	@JoinColumn({ name: 'product_id' })
	@ManyToOne(type => Product, product => product.productRatings)
	product: Product;

	@JoinColumn({ name: 'customer_id' })
	@ManyToOne(type => Customer, customer => customer.productRatings)
	customer: Customer;
}


