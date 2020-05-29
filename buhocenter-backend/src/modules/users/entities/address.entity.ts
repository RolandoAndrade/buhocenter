import { Entity,Column,ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../app/entities/base-entity';
import { Customer } from './customer.entity';
import { Status } from '../../status/entities/status.entity';

@Entity({ name: 'direction' })
export class Address extends BaseEntity {
	// @Column({ name: 'name', type: 'varchar', length: 100, nullable: false })
	// name: string;

	@JoinColumn({ name: 'customer_id' })
	@ManyToOne(type => Customer, customer => customer.addresses)
	customer: Customer

	@JoinColumn({ name: 'status_id' })
	@ManyToOne(type => Status , status => status.addresses)
	status: Status;
}
