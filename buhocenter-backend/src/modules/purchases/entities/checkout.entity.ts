import { Entity, Column, OneToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../app/entities/base-entity';
import { Cart } from '../../carts/entities/cart.entity';
import { StatusHistory } from '../../status/entities/status-history.entity';

@Entity('checkout') 
export class Checkout extends BaseEntity {

	@OneToMany(type => StatusHistory, statusHistories => statusHistories.checkout)
	statusHistories: StatusHistory[];
}
