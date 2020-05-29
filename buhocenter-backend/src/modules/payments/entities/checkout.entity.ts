import { Entity, OneToMany, JoinColumn, ManyToOne, Column } from 'typeorm';
import { BaseEntity } from '../../app/entities/base-entity';
import { Currency } from './currency.entity';
import { Cart } from '../../carts/entities/cart.entity';
import { StatusHistory } from '../../status/entities/status-history.entity';
import { ProductInventory } from '../../products/entities/product-inventory.entity';
import { ProductCart } from '../../carts/entities/product-cart.entity';

@Entity('checkout')
export class Checkout extends BaseEntity {

	@Column({ name: 'transaction_id', type: 'text', nullable: true })
	transactionId: string;
	
	@JoinColumn({ name: 'currency_id' })
	@ManyToOne(type => Currency , currency => currency.checkouts)
	currency: Currency;

	@OneToMany(type => StatusHistory, statusHistories => statusHistories.checkout)
	statusHistories: StatusHistory[];

	@OneToMany(type => ProductInventory, productInventories => productInventories.checkout)
	productInventories: ProductInventory[];

	@OneToMany(type => ProductCart, productCarts => productCarts.checkout)
	productCarts: ProductCart[];
}
