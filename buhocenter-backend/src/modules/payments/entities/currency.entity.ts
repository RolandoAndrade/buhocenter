import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../app/entities/base-entity';
import { Checkout } from './checkout.entity';

@Entity('currency') 
export class Currency extends BaseEntity {
	
	@Column({ name: 'name', type: 'text', nullable: false })
	name: string;

	@Column({ name: 'iso', type: 'text', nullable: false })
	iso: string;

	@OneToMany(type => Checkout, checkouts => checkouts.currency)
	checkouts: Checkout[];
}
