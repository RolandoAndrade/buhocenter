import { BaseEntity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export class PrimalEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ name: 'date_creacion', nullable: true })
    createdAt: Date;

    @CreateDateColumn({ name: 'date_modificacion', nullable: true })
    updatedAt: Date;
}
