import { Entity,Column,ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../app/entities/base-entity';
import { Customer } from '../../users/entities/customer.entity';

@Entity('notification')
export class Notification extends BaseEntity {
	@Column({ name: 'description', type: 'varchar', length: 100, nullable: false })
	description: string;

	@JoinColumn({ name: 'customer_id' })
	@ManyToOne(type => Customer, customer => customer.notifications)
	customer: Customer;
}
