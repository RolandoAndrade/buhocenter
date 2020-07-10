import { Entity, Column, OneToOne, ManyToOne, OneToMany } from 'typeorm';
import { PrimalEntity } from '../../../app/entities/base-entity';
import { User } from './user.entity';

@Entity({ name: 'roles' })
export class Role extends PrimalEntity {
    @Column({ name: 'name', type: 'varchar', length: 100, nullable: false })
    name: string;

    @Column({ name: 'priority', type: 'integer', nullable: false })
    priority: number;

    @OneToMany(
        type => User,
        users => users.role,
    )
    user: User[];
}
