import { BaseEntity } from '@/common/entities/base.entity';
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import {
    Column,
    Entity,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { EquipmentParkWorkUnitTypeEnum } from '../../modules/equipments/enums/equipment-park-work-unit-type.enum';
import { EquipmentParkObligation } from '@/entities/psql/equipment-park-obligation.entity';
import { EquipmentPark } from '@/entities/psql/equipment-park.entity';
import { MaintenanceStatusEnum } from '../../modules/equipments/enums/maintenance-status.enum';

@ObjectType()
@Entity('equipment_park_maintenance')
export class EquipmentParkMaintenance extends BaseEntity {
    constructor(data?: Partial<EquipmentParkMaintenance>) {
        super();
        Object.assign(this, data);
    }

    @PrimaryGeneratedColumn()
    @Field((type) => Int)
    id!: number;

    @ManyToOne(() => EquipmentPark, (park) => park.id, {
        nullable: true,
    })
    @Field((type) => EquipmentPark, { nullable: true })
    equipmentPark!: EquipmentPark;

    @Column({ nullable: true })
    equipment_park_id!: number;

    @OneToOne(() => EquipmentParkObligation, (obligation) => obligation.id, {
        nullable: true,
    })
    @Field((type) => EquipmentParkObligation, { nullable: true })
    obligation?: EquipmentParkObligation;

    @Column({ nullable: true })
    obligation_id?: number;

    @Column()
    @Field((type) => Int)
    maintenanceNumber!: number;

    @Column()
    @Field()
    operation!: string;

    @Column()
    @Field((type) => Float)
    duration!: number;

    @Column({ nullable: true })
    @Field({ nullable: true })
    remark?: string;

    @Column({
        type: 'enum',
        enum: EquipmentParkWorkUnitTypeEnum,
        nullable: true,
    })
    @Field((type) => EquipmentParkWorkUnitTypeEnum, { nullable: true })
    unitOfWork?: EquipmentParkWorkUnitTypeEnum;

    @Column({ nullable: true })
    @Field({ nullable: true })
    triggerDate?: Date;

    @Column({ type: 'float', nullable: true })
    @Field((type) => Float, { nullable: true })
    triggerNumber?: number;

    @Column({
        type: 'enum',
        enum: MaintenanceStatusEnum,
        default: MaintenanceStatusEnum.TODO,
    })
    @Field((type) => MaintenanceStatusEnum)
    status: MaintenanceStatusEnum;
}
