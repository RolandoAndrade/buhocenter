import { Entity, Column, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from '../../app/entities/base-entity';
import { Status } from '../../status/entities/status.entity';
import { Role } from './role.entity';
import { ProductRating } from '../../products/entities/product-rating.entity';
import { ServiceQuestion } from '../../services/entities/service-question.entity';
import { Cart } from '../../carts/entities/cart.entity';
import { ServiceRating } from '../../services/entities/service-rating.entity';
import { Notification } from '../../notifications/entities/notification.entity';
import { Platform } from '../../platform-management/entities/platform.entity';
import { ProductQuestion } from '../../products/entities/product-question.entity';

import { Address } from '../../address/entities/address.entity';

@Entity({ name: 'customer' })
export class Customer extends BaseEntity {

	@Column({ name: 'name', type: 'varchar', length: 100, nullable: false })
	name: string;

	@Column({ name: 'last_name', type: 'varchar', length: 100, nullable: false })
	lastName: string;

	@Column({ name: 'birthdate', nullable: true })
	birthdate: Date;

	@Column({ name: 'email', type: 'varchar', length: 100, nullable: false })
	email: string;

	@Column({ name: 'is_federate', type: 'boolean', nullable: false })
	is_federate: boolean;

	@Column({ name: 'uid', type: 'text', nullable: true })
	uid: string;

	@Column({ name: 'token', type: 'varchar', length: 200,  nullable: true })
	token: string;

	@JoinColumn({ name: 'status_id' })
	@ManyToOne(type => Status, status => status.customers)
	status: Status;

	@JoinColumn({ name: 'rol_id' })
	@ManyToOne(type => Role, role => role.customer)
	role: Role;

	@Column({ name: 'language_id', type: 'varchar', length: 4, nullable: true })
	language: string;

	@OneToMany(type => Address, addresses => addresses.customer)
	addresses: Address[];

	@OneToMany(type => ProductRating, productRatings => productRatings.customer)
	productRatings: ProductRating[];

	@OneToMany(type => ServiceQuestion, serviceQuestions => serviceQuestions.customer)
	serviceQuestions: ServiceQuestion[];

	@OneToMany(type => Cart, carts => carts.customer)
	carts: Cart[];

	@OneToMany(type => ServiceRating, serviceRatings => serviceRatings.customer)
	serviceRatings: ServiceRating[];

	@OneToMany(type => Notification, notifications => notifications.customer)
	notifications: Notification[];

	@OneToMany(type => Platform, platforms => platforms.customer)
	platforms: Platform[];

	@OneToMany(type => ProductQuestion, productQuestions => productQuestions.customer)
	productQuestions: ProductQuestion[];
}
