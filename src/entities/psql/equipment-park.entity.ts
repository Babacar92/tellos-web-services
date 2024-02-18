import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoryEquipment } from './CategoryEquipmentEntity';
import { EntityEntity } from './EntityEntity';
import { Employee } from './EmployeeEntity';
import { UploadEntity } from './UploadEntity';
import { EquipmentTypeEnum } from 'src/modules/equipments/enums/equipment.type.enum';
import { BaseEntity } from 'src/common/entities/base.entity';
import { EquipmentParkWorkUnitTypeEnum } from '@/modules/equipments/enums/equipment-park-work-unit-type.enum';

@ObjectType()
@Entity('equipment_park')
export class EquipmentPark extends BaseEntity {
    constructor(data?: Partial<EquipmentPark>) {
        super();
        if (data) Object.assign(this, data);
    }

    @PrimaryGeneratedColumn()
    @Field((type) => Int)
    id!: number;

    @Column()
    @Field()
    code!: string;

    @Column()
    @Field()
    denomination!: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    registrationNumber?: string;

    @ManyToOne(() => CategoryEquipment, (entity) => entity.equipmentParks)
    @JoinColumn({ name: 'category_id' })
    @Field(() => CategoryEquipment)
    category!: CategoryEquipment;

    @Column()
    category_id: number;

    @ManyToOne(() => EntityEntity, (entity) => entity.equipmentParks)
    @JoinColumn({ name: 'entity_id' })
    @Field((type) => EntityEntity)
    entity!: EntityEntity;

    @Column()
    entity_id: number;

    @ManyToOne(() => Employee, (employee) => employee.materialParks, {
        nullable: true,
    })
    @JoinColumn()
    @Field(() => Employee, { nullable: true })
    employee?: Employee;

    @Column({ nullable: true })
    employee_id?: number;

    @ManyToMany(() => UploadEntity)
    @JoinTable({ name: 'equipment_park_upload' })
    @Field((type) => [UploadEntity])
    pictures: UploadEntity[];

    @Column({ nullable: true })
    @Field({ nullable: true })
    orderNumber?: string;

    @Column({ nullable: true, type: 'date' })
    @Field(() => Date, { nullable: true })
    orderDate?: Date;

    @Field(() => Date, { nullable: true })
    @Column({ nullable: true, type: 'date' })
    deliveryDate?: Date;

    @Column({ nullable: true, type: 'date' })
    @Field((type) => Date, { nullable: true })
    firstCirculation?: Date;

    @Column({ nullable: true, type: 'date' })
    @Field((type) => Date, { nullable: true })
    registrationDate?: Date;

    @Column({ nullable: true, type: 'float' })
    @Field((type) => Float, { nullable: true })
    originalValue?: number;

    @Column({ nullable: true, type: 'float' })
    @Field((type) => Float, { nullable: true })
    counter?: number;

    @Column({ nullable: true, type: 'float' })
    @Field((type) => Float, { nullable: true })
    standardCost?: number;

    @Column({ nullable: true, type: 'float' })
    @Field((type) => Float, { nullable: true })
    co2Emission?: number;

    @Column({
        nullable: true,
        type: 'enum',
        enum: EquipmentTypeEnum,
    })
    @Field((type) => EquipmentTypeEnum, { nullable: true })
    type?: EquipmentTypeEnum;

    @Column({ type: 'boolean', default: true })
    @Field((type) => Boolean)
    active: boolean;

    @Column({ nullable: true })
    @Field({ nullable: true })
    startDate?: Date;

    @Column({ nullable: true })
    @Field({ nullable: true })
    endDate?: Date;

    @Column({
        type: 'enum',
        enum: EquipmentParkWorkUnitTypeEnum,
        nullable: true,
    })
    @Field((type) => EquipmentParkWorkUnitTypeEnum, { nullable: true })
    unitOfWork?: EquipmentParkWorkUnitTypeEnum;

    @Column({ type: 'boolean', default: true })
    @Field({ defaultValue: true })
    available: boolean;

    static init(id?: number): EquipmentPark {
        return id ? new EquipmentPark({ id }) : null;
    }
}
