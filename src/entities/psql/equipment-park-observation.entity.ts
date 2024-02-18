//NestJs
import { Field, Int, ObjectType } from '@nestjs/graphql';

//TypeOrm
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from 'src/common/entities/base.entity';
import { EquipmentPark } from '@/entities/psql/equipment-park.entity';

@ObjectType()
@Entity('equipment_park_observation')
export class EquipmentParkObservation extends BaseEntity {
    constructor(data?: Partial<EquipmentParkObservation>) {
        super();
        Object.assign(this, data);
    }

    @PrimaryGeneratedColumn()
    @Field((type) => Int)
    id!: number;

    @ManyToOne(() => EquipmentPark, (equipmentPark) => equipmentPark.id)
    @JoinColumn()
    @Field((type) => EquipmentPark)
    equipmentPark: EquipmentPark;

    @Column()
    equipment_park_id: number;

    @Column({ nullable: true })
    @Field({ nullable: true })
    observation?: string;

    @Column({ nullable: true })
    @Field((type) => Date, { nullable: true })
    date?: Date;
}
