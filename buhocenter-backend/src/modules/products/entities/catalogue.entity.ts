import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../app/entities/base-entity';
import { ServiceCatalogue } from '../../services/entities/service-catalogue.entity';
import { ProductCatalogue } from './product-catalogue.entity';

@Entity('catalogue') 
export class Catalogue extends BaseEntity {
	
	@Column({ name: 'name', type: 'varchar', length: 100, nullable: false })
	name: string;

	@Column({name: 'description', type: 'varchar', length: 100, nullable: true })
	description: string;

	@Column({name: 'term', type: 'varchar', length: 100, nullable: true })
	term: string;

	@OneToMany(type => ServiceCatalogue, serviceCatalogues => serviceCatalogues.catalogue)
	serviceCatalogues: ServiceCatalogue[];

	@OneToMany(type => ProductCatalogue, productCatalogues => productCatalogues.catalogue)
	productCatalogues: ProductCatalogue[];
}
