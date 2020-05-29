import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../app/entities/base-entity';
import { Checkout } from './checkout.entity';

@Entity('payment') 
export class Payment extends BaseEntity {

	@Column({ type: 'decimal', nullable: false })
	total: number;

	@JoinColumn({ name: 'checkout_id' })
	@ManyToOne(type => Checkout, checkout => checkout.id)
	checkout: Checkout;
}
