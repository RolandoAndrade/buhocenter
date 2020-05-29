import { PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

export class BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    
    @CreateDateColumn({ name: 'date_creacion', nullable: true })
    createdAt: Date;
    
    @CreateDateColumn({ name: 'date_modificacion', nullable: true })
	updatedAt: Date;
}