//NestJs
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

//TypeOrm
import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import { ExitTypeEnum } from 'src/modules/equipments/enums/exit-type.enum';
import { SellTypeEnum } from 'src/modules/equipments/enums/sell-type.enum';
import { EquipmentPark } from 'src/entities/psql/equipment-park.entity';
import { OwnerEntity } from 'src/entities/psql/owner-entity.entity';
import { EquipmentFunding } from 'src/entities/psql/equipment-funding.entity';
import { Employee } from 'src/entities/psql/EmployeeEntity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { EntityEntity } from './EntityEntity';
import { CustomerEntity } from './CustomerEntity';

@ObjectType()
@Entity('equipment_administrative')
@Unique('EA_GEOLOC_BOX_NUMBER', ['geolocationBoxNumber'])
@Unique('EA_TOTAL_CARD', ['totalCard'])
@Unique('UQ_ANGO_PASS', ['angoPASS'])
export class EquipmentAdministrative extends BaseEntity {
    constructor(data?: Partial<EquipmentAdministrative>) {
        super();
        Object.assign(this, data);
    }

    @PrimaryGeneratedColumn()
    @Field((type) => Int)
    id!: number;

    @OneToOne(() => EquipmentPark, { onDelete: 'CASCADE' })
    @JoinColumn()
    @Field((type) => EquipmentPark)
    equipmentPark: EquipmentPark;

    @Column()
    equipment_park_id: number;

    @OneToOne(() => OwnerEntity, (owner) => owner.id, { nullable: true })
    @JoinColumn()
    @Field((type) => OwnerEntity, { nullable: true })
    ownerCompany?: OwnerEntity;

    @Column({ nullable: true })
    owner_company_id?: number;

    @ManyToOne(() => EquipmentFunding, (funding) => funding.id)
    @JoinColumn()
    @Field((type) => EquipmentFunding, { nullable: true })
    funding?: EquipmentFunding;

    @Column({ nullable: true })
    funding_id?: number;

    @Column({ nullable: true, type: 'float' })
    @Field((type) => Float, { nullable: true })
    monthlyRent?: number;

    @Column({ nullable: true, type: 'float' })
    @Field((type) => Float, { nullable: true })
    maintenanceRent?: number;

    @Column({ nullable: true })
    @Field((type) => Float, { nullable: true })
    maxAllowedKm?: number;

    @Column({ nullable: true })
    @Field((type) => Date, { nullable: true })
    contractStartDate?: Date;

    @Column({ nullable: true })
    @Field((type) => Date, { nullable: true })
    contractEndDate?: Date;

    @Column({ nullable: true, type: 'float' })
    @Field((type) => Float, { nullable: true })
    buyBackValue?: number;

    @Column({ nullable: true })
    @Field((type) => String, { nullable: true })
    immobilizationCode?: string;

    @Column({ nullable: true, type: 'enum', enum: ExitTypeEnum })
    @Field((type) => ExitTypeEnum, { nullable: true })
    exitType?: ExitTypeEnum;

    @Column({ nullable: true })
    @Field((type) => Date, { nullable: true })
    mutationDate?: Date;

    @Column({ nullable: true, type: 'enum', enum: SellTypeEnum })
    @Field((type) => SellTypeEnum, { nullable: true })
    sellType?: SellTypeEnum;

    @ManyToOne(() => CustomerEntity, (customer) => customer.id, {
        nullable: true,
    })
    @JoinColumn()
    @Field((type) => CustomerEntity, { nullable: true })
    customerAsCustomer?: CustomerEntity;

    @Column({ nullable: true })
    customer_as_customer_id?: number;

    @ManyToOne(() => EntityEntity, (entity) => entity.id, { nullable: true })
    @JoinColumn()
    @Field((type) => EntityEntity, { nullable: true })
    customerAsEntity?: EntityEntity;

    @Column({ nullable: true })
    customer_as_entity_id?: number;

    @Column({ nullable: true })
    @Field((type) => Float, { nullable: true })
    sellingPrice?: number;

    @Column({ nullable: true })
    @Field({ nullable: true })
    waitingForRelease?: boolean;

    @Column({ nullable: true })
    @Field({ nullable: true })
    geolocationBoxNumber?: string;

    @Column({ nullable: true, type: 'float' })
    @Field((type) => Float, { nullable: true })
    geolocationBoxMonthlyCost?: number;

    @Column({ nullable: true })
    @Field((type) => Int, { nullable: true })
    geolocationContractStartDate?: Date;

    @Column({ nullable: true })
    @Field((type) => Int, { nullable: true })
    geolocationContractEndDate?: Date;

    @Column({ nullable: true })
    @Field({ nullable: true })
    totalCard?: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    angoPASS?: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    carFleetInsurance?: boolean;

    @Column({ nullable: true })
    @Field({ nullable: true })
    machineBreakdownInsurance?: boolean;

    @Column({ type: 'float', nullable: true })
    @Field((type) => Float, { nullable: true })
    useRate?: number;

    @Column({ nullable: true })
    @Field((type) => Float, { nullable: true })
    nbHoursEntered?: number;

    @ManyToMany(() => Employee, {
        nullable: true,
    })
    @JoinTable({ name: 'equipment_administrative_user_to_notify' })
    @Field((type) => [Employee], { nullable: true })
    usersToNotify?: Employee[];

    @Column({ nullable: true })
    @Field({ nullable: true })
    comment?: string;
}
