import { BaseEntity } from '@/common/entities/base.entity';
import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { SheetTypeEnum } from '../../modules/equipments/enums/sheet-type.enum';
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Employee } from '@/entities/psql/EmployeeEntity';
import { UploadEntity } from '@/entities/psql/UploadEntity';
import { CritAirEnum } from '../../modules/equipments/enums/critair.enum';
import { EquipmentPark } from '@/entities/psql/equipment-park.entity';
import { LoginEntity } from './LoginEntity';

@ObjectType()
@Entity('equipment_park_sheet')
export class EquipmentParkSheet extends BaseEntity {
    constructor(data: Partial<EquipmentParkSheet>) {
        super();
        Object.assign(this, data);
    }

    @PrimaryGeneratedColumn()
    @Field((type) => Int)
    id!: number;

    @OneToOne(() => EquipmentPark, (equipment) => equipment.id)
    @Field((type) => EquipmentPark)
    equipmentPark!: EquipmentPark;

    @Column()
    equipment_park_id: number;

    @Column({ type: 'enum', enum: SheetTypeEnum })
    @Field((type) => SheetTypeEnum)
    type!: SheetTypeEnum;

    @Column()
    @Field()
    returnDate!: Date;

    @ManyToOne(() => Employee, (employee) => employee.id, {
        nullable: true,
    })
    @Field((type) => Employee, { nullable: true })
    user?: Employee;

    @Column({ nullable: true })
    user_id?: number;

    @ManyToOne(() => LoginEntity, (login) => login.id, {
        nullable: true,
    })
    @Field((type) => LoginEntity, { nullable: true })
    controller?: LoginEntity;

    @Column({ nullable: true })
    contoller_id?: number;

    @Column({ nullable: true })
    @Field({ nullable: true })
    parkNumber?: string;

    @Column({ nullable: true })
    @Field((type) => Float, { nullable: true })
    counter?: number;

    @Column({ nullable: true })
    @Field({ nullable: true })
    fuelLevel?: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    generalState?: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    interiorCleanliness?: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    exteriorCleanliness?: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    observation?: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    thumnailCritAir?: boolean;

    @Column({ type: 'enum', enum: CritAirEnum, nullable: true })
    @Field((type) => CritAirEnum, { nullable: true })
    thumnailCritAirNumber?: CritAirEnum;

    @Column({ nullable: true })
    @Field({ nullable: true })
    insurance?: boolean;

    @Column({ nullable: true })
    @Field({ nullable: true })
    failureCard?: boolean;

    @Column({ nullable: true })
    @Field({ nullable: true })
    totalCard?: boolean;

    @Column({ nullable: true })
    @Field({ nullable: true })
    badge?: boolean;

    @ManyToMany(() => UploadEntity)
    @JoinTable({ name: 'equipment_park_sheet_upload' })
    @Field((type) => [UploadEntity], { nullable: true })
    photos?: UploadEntity[];

    @OneToOne(() => UploadEntity)
    @JoinColumn()
    @Field((type) => UploadEntity, { nullable: true })
    userSignature?: UploadEntity;

    @Column({ nullable: true })
    user_signature_id?: number;

    @OneToOne(() => UploadEntity)
    @JoinColumn()
    @Field((type) => UploadEntity, { nullable: true })
    controllerSignature?: UploadEntity;

    @Column({ nullable: true })
    controller_signature_id?: number;
}
