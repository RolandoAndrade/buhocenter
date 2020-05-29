import {Entity, Column, OneToOne, ManyToOne, OneToMany} from 'typeorm';
import { BaseEntity } from '../../app/entities/base-entity';
import { Customer } from './customer.entity';

@Entity({ name: 'role' }) 
export class Role extends BaseEntity {
	@Column({ name: 'name', type: 'varchar', length: 100, nullable: false })
	name: string;

	@Column({ name: 'priority', type: 'integer', nullable: false })
	priority: number;

	@OneToMany(type => Customer, customer => customer.role)
	customer: Customer;
}
