import { Entity, Column, OneToMany } from 'typeorm';
import { PrimalEntity } from '../../../app/entities/base-entity';
import { Catalogue } from './catalogue.entity';

@Entity('categories')
export class Category extends PrimalEntity {
    @Column({ name: 'name', type: 'varchar', length: 100, nullable: false })
    name: string;

    @Column({
        name: 'icon',
        type: 'varchar',
        length: 100,
        nullable: true,
    })
    icon: string;

    @Column({ name: 'term', type: 'varchar', length: 100, nullable: true })
    term: string;

    @OneToMany(
        type => Catalogue,
        catalogues => catalogues.category,
    )
    catalogues: Catalogue[];
}
