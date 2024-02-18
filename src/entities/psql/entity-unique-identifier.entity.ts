import { BaseEntity } from '@/common/entities/base.entity';
import { EntityEntity } from '@/entities/psql/EntityEntity';
import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('entity_unique_identifier')
export class EntityUniqueIdentifier extends BaseEntity {
    constructor(data: Partial<EntityUniqueIdentifier>) {
        super();
        Object.assign(this, data);
    }
    @PrimaryGeneratedColumn()
    id!: number;

    @OneToOne(() => EntityEntity, (entity) => entity.id)
    @JoinColumn()
    entity!: EntityEntity;

    @Column()
    entity_id!: number;

    @Column()
    identifier!: number;
}
