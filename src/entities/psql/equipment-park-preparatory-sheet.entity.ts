import { BaseEntity } from '@/common/entities/base.entity';
import { Employee } from '@/entities/psql/EmployeeEntity';
import { EquipmentPark } from '@/entities/psql/equipment-park.entity';
import { Field, ObjectType } from '@nestjs/graphql';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity('equipment_park_preparatory_sheet')
export class EquipmentParkPreparatorySheet extends BaseEntity {
    constructor(data: Partial<EquipmentParkPreparatorySheet>) {
        super();
        Object.assign(this, data);
    }

    @PrimaryGeneratedColumn()
    id!: number;

    @OneToOne(() => EquipmentPark)
    @JoinColumn()
    @Field((type) => EquipmentPark)
    equipmentPark!: EquipmentPark;

    @Column()
    equipment_park_id!: number;

    @Column({ nullable: true })
    @Field({ nullable: true })
    dieselCardReturned?: boolean;

    @ManyToOne(() => Employee, (employee) => employee.id, { nullable: true })
    @Field((type) => Employee, { nullable: true })
    dieselCardReturnedTo?: Employee;

    @Column({ nullable: true })
    diesel_card_returned_to_id?: number;

    @Column({ nullable: true })
    @Field({ nullable: true })
    chipRemovedAndReturned?: boolean;

    @ManyToOne(() => Employee, (employee) => employee.id, { nullable: true })
    @Field((type) => Employee, { nullable: true })
    chipRemovedAndReturnedTo?: Employee;

    @Column({ nullable: true })
    chip_removed_and_returned_to_id?: number;

    @Column({ nullable: true })
    @Field({ nullable: true })
    originalRegistrationDocument?: boolean;

    @Column({ nullable: true })
    @Field({ nullable: true })
    duplicateKeys?: boolean;

    @Column({ nullable: true })
    @Field({ nullable: true })
    insuranceWithdrawn?: boolean;

    @Column({ nullable: true })
    @Field({ nullable: true })
    vehicleEmpty?: boolean;

    @Column({ nullable: true })
    @Field({ nullable: true })
    isMarkingRemoved?: boolean;

    @Column({ nullable: true })
    @Field({ nullable: true })
    starts?: boolean;

    @Column({ nullable: true })
    @Field({ nullable: true })
    RollingVehicule?: boolean;

    @Column({ nullable: true })
    @Field({ nullable: true })
    mainWorks?: string;
}
