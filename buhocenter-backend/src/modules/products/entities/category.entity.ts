import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../app/entities/base-entity';
import { ProductCategory } from './product-category.entity';
import { ServiceCategory } from '../../services/entities/service-category.entity';

@Entity({ name: 'category' })
export class Category extends BaseEntity {
	@Column({ name: 'name', type: 'varchar', length: 100, nullable: false })
	name: string;

    @Column({ name: 'icon', type: 'varchar', length: 100, nullable: true })
    icon: string;

    @Column({ name: 'term', type: 'varchar', length: 150, nullable: true })
    term: string;

	@OneToMany(type => ProductCategory, productCategories => productCategories.category)
    productCategories: ProductCategory[];

    @OneToMany(type => ServiceCategory, serviceCategories => serviceCategories.category)
    serviceCategories: ServiceCategory[];
}
