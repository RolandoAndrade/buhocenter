import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../app/entities/base-entity';
import { ProductProvider } from './product-provider.entity';
import { ServiceProvider } from '../../services/entities/service-provider.entity';

@Entity({ name: 'provider' }) 
export class Provider extends BaseEntity {

	@Column({ name: 'name', type: 'text', nullable: false })
	name: string;

	@OneToMany(type => ProductProvider, productProviders => productProviders.provider)
    productProviders: ProductProvider[];
    
    @OneToMany(type => ServiceProvider, serviceProviders => serviceProviders.provider)
	serviceProviders: ServiceProvider[];
}
