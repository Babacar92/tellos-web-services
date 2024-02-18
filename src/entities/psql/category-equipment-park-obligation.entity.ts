import { BaseEntity } from '@/common/entities/base.entity';
import { CategoryEquipment } from '@/entities/psql/CategoryEquipmentEntity';
import { EquipmentPark } from '@/entities/psql/equipment-park.entity';
import { Field, Int } from '@nestjs/graphql';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EquipmentParkObligation } from './equipment-park-obligation.entity';

@Entity('category_equipment_park_obligation')
export class CategoryEquipmentParkObligation extends BaseEntity {
    constructor(data: Partial<CategoryEquipmentParkObligation>) {
        super();
        Object.assign(this, data);
    }

    @PrimaryGeneratedColumn()
    @Field((type) => Int)
    id!: number;

    @ManyToOne(() => EquipmentPark)
    @JoinColumn({ name: 'equipment_park_id', referencedColumnName: 'id' })
    @Field((type) => EquipmentPark, { nullable: true })
    equipmentPark?: EquipmentPark;

    @ManyToOne(() => CategoryEquipment)
    @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
    @Field((type) => CategoryEquipment, { nullable: true })
    category?: CategoryEquipment;

    @ManyToOne(() => EquipmentParkObligation)
    @JoinColumn({ name: 'obligation_id', referencedColumnName: 'id' })
    @Field((type) => EquipmentParkObligation)
    obligation?: EquipmentParkObligation;
}
