import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../app/entities/base-entity';
import { Platform } from './platform.entity';

@Entity({ name: 'platform_parameter' }) 
export class PlatformParameter extends BaseEntity {
	
	@Column({ type: 'text', nullable: false })
	name: string;

	@OneToMany(type => Platform, platforms => platforms.platformParameter)
	platforms: Platform[];
}
