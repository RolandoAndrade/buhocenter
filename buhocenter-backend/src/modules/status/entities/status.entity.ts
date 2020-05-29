import { Entity,Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../app/entities/base-entity';
import { Cart } from '../../carts/entities/cart.entity';
import { StatusHistory } from './status-history.entity';
import { Product } from '../../products/entities/product.entity';
import { Service } from '../../services/entities/service.entity';
import { Customer } from '../../users/entities/customer.entity';
import { Address } from '../../address/entities/address.entity';
import { Offer } from '../../products/entities/offer.entity';
import { Checkout } from '../../payments/entities/checkout.entity';
import { Platform } from '../../platform-management/entities/platform.entity';
import { ProductInventory } from '../../products/entities/product-inventory.entity';
import { ProductCart } from '../../carts/entities/product-cart.entity';

@Entity('status')
export class Status extends BaseEntity {
	@Column({ name: 'name', type: 'varchar', length: 100, nullable: false })
	name: string;

	@Column({ name: 'description', type: 'varchar', length: 100, nullable: true })
	description: string;

	@OneToMany(type => Customer, customers => customers.status)
	customers: Customer[];

	@OneToMany(type => Address, addresses => addresses.status)
	addresses: Address[];

	@OneToMany(type => Cart, carts => carts.status)
	carts: Cart[];

	@OneToMany(type => Product, products => products.status)
	products: Product[];

	@OneToMany(type => Service, services => services.status)
	services: Service[];

	@OneToMany(type => Offer, offers => offers.status)
	offers: Offer[];

	@OneToMany(type => StatusHistory, statusHistories => statusHistories.status)
	statusHistories: StatusHistory[];

	@OneToMany(type => Platform, platforms => platforms.status)
	platforms: Platform[];

	@OneToMany(type => ProductInventory, productInventories => productInventories.status)
	productInventories: ProductInventory[];
}
