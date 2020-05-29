import { Entity,Column,ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../app/entities/base-entity';
import { Product } from '../../products/entities/product.entity';
import { Cart } from './cart.entity';
import { Checkout } from '../../payments/entities/checkout.entity';

@Entity({ name: 'cart_product' })
export class ProductCart extends BaseEntity {
	
	@Column({ name: 'quantity', type: 'integer', nullable: false })
	quantity: number;

	@JoinColumn({ name: 'product_id' })
	@ManyToOne(type => Product , product => product.productCarts)
	product: Product;

	@JoinColumn({ name: 'cart_id' })
	@ManyToOne(type => Cart, cart => cart.productCarts)
	cart: Cart;

	@JoinColumn({ name: 'checkout_id' })
	@ManyToOne(type => Checkout, checkout => checkout.productCarts)
	checkout: Checkout;
}
