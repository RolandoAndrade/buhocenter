import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../app/entities/base-entity';
import { Service } from '../../services/entities/service.entity';
import { Cart } from './cart.entity';

@Entity('cart_service') 
export class ServiceCart extends BaseEntity {
	
	@Column({ name: 'quantity_product', type: 'integer', nullable: false })
	quantity: number;

	@JoinColumn({ name: 'service_id' })
	@ManyToOne(type => Service, service => service.serviceCarts)
	service: Service;

	@JoinColumn({ name: 'cart_id' })
	@ManyToOne(type => Cart, cart => cart.serviceCarts)
	cart: Cart;
}
