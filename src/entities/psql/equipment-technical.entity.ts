import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from 'src/common/entities/base.entity';
import { TiresTypeEnum } from 'src/modules/equipments/enums/tire-type.enum';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { EquipmentTechnicalGenre } from '@/entities/psql/equipment-technical-genre.entity';
import { EquipmentPark } from '@/entities/psql/equipment-park.entity';
import { EquipmentTechnicalThumbnail } from './equipment-technical-thumbnail.entity';
import { Good } from './good.entity';

@ObjectType()
@Entity('equipment_technical')
export class EquipmentTechnical extends BaseEntity {
    constructor(data?: Partial<EquipmentTechnical>) {
        super();

        if (data) {
            Object.assign(this, data);
        }
    }

    @PrimaryGeneratedColumn()
    @Field((type) => Int)
    id!: number;

    @OneToOne(() => EquipmentPark, (equipmentPark) => equipmentPark.id, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    @Field((type) => EquipmentPark)
    equipmentPark!: EquipmentPark;

    @Column()
    equipment_park_id!: number;

    @Column({
        type: 'enum',
        enum: TiresTypeEnum,
        nullable: true,
    })
    @Field((type) => TiresTypeEnum, { nullable: true })
    tiresType?: TiresTypeEnum;

    @Column({ nullable: true })
    @Field((type) => Float, { nullable: true })
    tonnage?: number;

    @ManyToOne(() => EquipmentTechnicalGenre, (genre) => genre.id, {
        nullable: true,
    })
    @JoinColumn()
    @Field((type) => EquipmentTechnicalGenre, { nullable: true })
    genre?: EquipmentTechnicalGenre;

    @Column({ nullable: true })
    genre_id?: number;

    @ManyToOne(() => EquipmentTechnicalThumbnail, (thumbnail) => thumbnail.id, {
        nullable: true,
    })
    @JoinColumn()
    @Field((type) => EquipmentTechnicalThumbnail, { nullable: true })
    thumbnailCritAir?: EquipmentTechnicalThumbnail;

    @Column({ nullable: true })
    thumbnail_crit_air_id?: number;

    @Column({ nullable: true })
    @Field({ nullable: true })
    brand?: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    type?: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    series?: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    sheetMetal?: string;

    @Column({ nullable: true })
    @Field((type) => Float, { nullable: true })
    power?: number;

    @Column({ nullable: true })
    @Field((type) => Int, { nullable: true })
    seats?: number;

    @Column({ nullable: true })
    @Field((type) => Float, { nullable: true })
    consumption?: number;

    @Column({ nullable: true })
    @Field((type) => Float, { nullable: true })
    ptac?: number;

    @Column({ nullable: true })
    @Field((type) => Float, { nullable: true })
    pv?: number;

    @Column({ nullable: true })
    @Field((type) => Float, { nullable: true })
    ptra?: number;

    @Column({ nullable: true })
    @Field({ nullable: true })
    energy?: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    roadSpeed?: number;

    @Column({ nullable: true })
    @Field({ nullable: true })
    engine?: string;

    @Column({ nullable: true })
    @Field((type) => String, { nullable: true })
    engineSerialNumber?: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    box?: string;

    @Column({ nullable: true })
    @Field({ nullable: true })
    boxSerialNumber?: string;

    @Column({ nullable: true })
    @Field((type) => Float, { nullable: true })
    length?: number;

    @Column({ nullable: true })
    @Field((type) => Float, { nullable: true })
    width?: number;

    @Column({ nullable: true })
    @Field((type) => Float, { nullable: true })
    height?: number;

    @ManyToOne(() => Good, (good) => good.id, { nullable: true })
    @Field((type) => Good, { nullable: true })
    @JoinColumn()
    pneumaticTypeOne?: Good; // Articles

    @Column({ nullable: true })
    pneumatic_type_one_id?: number;

    @Column({ nullable: true })
    @Field((type) => Float, { nullable: true })
    quantityOne?: number;

    @ManyToOne(() => Good, (good) => good.id, { nullable: true })
    @Field((type) => Good, { nullable: true })
    @JoinColumn()
    pneumaticTypeTwo?: Good; // Articles

    @Column({ nullable: true })
    pneumatic_type_two_id?: number;

    @Column({ nullable: true })
    @Field((type) => Float, { nullable: true })
    quantityTwo?: number;

    @ManyToOne(() => Good, (good) => good.id, { nullable: true })
    @Field((type) => Good, { nullable: true })
    @JoinColumn()
    gearboxLubricantType?: Good;

    @Column({ nullable: true })
    gearbox_lubricant_type_id?: number;

    @Column({ nullable: true })
    @Field((type) => Float, { nullable: true })
    gearboxLubricantQuantity?: number;

    @ManyToOne(() => Good, (good) => good.id, { nullable: true })
    @Field((type) => Good, { nullable: true })
    @JoinColumn()
    bridgeLubricantType?: Good;

    @Column({ nullable: true })
    bridge_lubricant_type_id?: number;

    @Column({ nullable: true })
    @Field((type) => Float, { nullable: true })
    bridgeLubricantQuantity?: number;

    @ManyToOne(() => Good, (good) => good.id, { nullable: true })
    @Field((type) => Good, { nullable: true })
    @JoinColumn()
    engineLubricantType?: Good;

    @Column({ nullable: true })
    engine_lubricant_type_id?: number;

    @Column({ nullable: true })
    @Field((type) => Float, { nullable: true })
    engineLubricantQuantity?: number;

    @ManyToOne(() => Good, (good) => good.id, { nullable: true })
    @Field((type) => Good, { nullable: true })
    @JoinColumn()
    daLubricantType?: Good;

    @Column({ nullable: true })
    da_lubricant_type_id?: number;

    @Column({ nullable: true })
    @Field((type) => Float, { nullable: true })
    daLubricantQuantity?: number;

    @ManyToOne(() => Good, (good) => good.id, { nullable: true })
    @Field((type) => Good, { nullable: true })
    @JoinColumn()
    hydrolicOilType?: Good;

    @Column({ nullable: true })
    hydrolic_oil_type_id?: number;

    @Column({ nullable: true })
    @Field((type) => Float, { nullable: true })
    hydrolicOilQuantity?: number;
}
