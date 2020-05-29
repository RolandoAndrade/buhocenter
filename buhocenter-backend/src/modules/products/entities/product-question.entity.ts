import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../app/entities/base-entity';
import { Product } from '../../products/entities/product.entity';
import { Customer } from '../../users/entities/customer.entity';

@Entity({ name: 'product_question' }) 
export class ProductQuestion extends BaseEntity {
	
	@Column({ name: 'comment', type: 'text', nullable: false })
	comment: string;

	@JoinColumn({ name: 'product_id' })
	@ManyToOne(type => Product , product => product.questions)
	product: Product;

	@JoinColumn({ name: 'customer_id' })
	@ManyToOne(type => Customer, customer => customer.productQuestions)
	customer: Customer;
}
