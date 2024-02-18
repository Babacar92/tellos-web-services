import { BaseEntity } from '@/common/entities/base.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EntityEntity } from '../../entities/psql/EntityEntity';

@Entity('construction_site_entity_unique_identifier')
export class ConstructionSiteIdentifier extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    identifier!: number;

    @Column({ nullable: true })
    subIdentifier?: number;

    @OneToMany(() => EntityEntity, (entity) => entity.id)
    entity!: EntityEntity;

    @Column()
    entity_id!: number;
}
