import { BaseEntity } from '@/common/entities/base.entity';
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ObligationTypeEnum } from '@/modules/equipments/enums/obligation-type.enum';
import { ObligationTriggerUnitEnum } from '@/modules/equipments/enums/obligation-trigger-unit.enum';
import { MaintenanceStatusEnum } from '@/modules/equipments/enums/maintenance-status.enum';
import { ObligationType } from './obligation-type.entity';

@ObjectType()
@Entity('equipment_park_obligation')
export class EquipmentParkObligation extends BaseEntity {
    constructor(data: Partial<EquipmentParkObligation>) {
        super();
        Object.assign(this, data);
    }

    @PrimaryGeneratedColumn()
    @Field((type) => Int)
    id!: number;

    @Column({ type: 'enum', enum: ObligationTypeEnum })
    @Field((type) => ObligationTypeEnum)
    type!: ObligationTypeEnum;

    @ManyToOne(() => ObligationType, (type) => type.id)
    @Field(() => ObligationType)
    label!: ObligationType;

    @Column()
    label_id: number;

    @Column()
    @Field((type) => Float)
    periodicity!: number;

    @Column({ type: 'enum', enum: ObligationTriggerUnitEnum })
    @Field((type) => ObligationTriggerUnitEnum)
    triggerUnit!: ObligationTriggerUnitEnum;

    @Column({ nullable: true })
    @Field((type) => Float, { nullable: true })
    maintenanceDuration?: number;

    @Column()
    @Field()
    documentRequired!: boolean;

    @Column({ nullable: true })
    @Field({ nullable: true })
    lastControlDate?: Date;

    @Column({ nullable: true })
    @Field({ nullable: true })
    nextControlDate?: Date;

    @Column({ nullable: true })
    @Field((type) => Float, { nullable: true })
    lastControlCounter?: number;

    @Column({ nullable: true })
    @Field((type) => Float, { nullable: true })
    nextControlCounter?: number;

    @Column({
        type: 'enum',
        enum: MaintenanceStatusEnum,
        default: MaintenanceStatusEnum.TODO,
    })
    @Field((type) => MaintenanceStatusEnum)
    status: MaintenanceStatusEnum;
}
