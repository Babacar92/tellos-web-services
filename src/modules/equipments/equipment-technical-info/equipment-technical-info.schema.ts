//NestJs
import { Field, Int, ObjectType } from '@nestjs/graphql';

//TypeOrm
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

//Schemas
import { BaseEntity } from 'src/common/entities/base.entity';

//Enums
import { EquipmentGenreEnum } from '../enums/equipmentGenre.enum';
import { CritAirEnum } from '../enums/critair.enum';
import { PneumaticTypeEnum } from '../enums/pneumaticType.enum';
import { TransmissionLubricantEnum } from '../enums/transmissionLubricant.enum';
import { AxleLubricantEnum } from '../enums/axleLubricant.enum';
import { EngineLubricantEnum } from '../enums/engineLubricant.enum';
import { PowerSteeringLubricantEnum } from '../enums/powerSteeringLubricant.enum';
import { HydraulicOilEnum } from '../enums/hydraulicOil.enum';

@ObjectType()
@Entity('equipment_administrative')
export class EquipmentTechInfoSchema extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id!: number;

  @Column({
    nullable: true,
    type: 'enum',
    enum: EquipmentGenreEnum,
  })
  @Field((type) => EquipmentGenreEnum, { nullable: true })
  genre?: EquipmentGenreEnum | null;

  @Column({ nullable: true })
  @Field({ nullable: true })
  brand?: string | null;

  @Column({ nullable: true })
  @Field({ nullable: true })
  type?: string | null;

  @Column({ nullable: true })
  @Field({ nullable: true })
  serie?: string | null;

  @Column({ nullable: true })
  @Field({ nullable: true })
  bodyType?: string | null;

  @Field({ nullable: true })
  @Column({ nullable: true })
  assetCode: number | null;

  @Field({ nullable: true })
  @Column({ nullable: true })
  powerHP: number | null;

  @Field({ nullable: true })
  @Column({ nullable: true })
  seatingCapacity: number | null;

  @Field({ nullable: true })
  @Column({ nullable: true })
  fuelConsumption: number | null;

  @Field({ nullable: true })
  @Column({ nullable: true })
  ptac: number | null;

  @Field({ nullable: true })
  @Column({ nullable: true })
  pv: number | null;

  @Field({ nullable: true })
  @Column({ nullable: true })
  ptra: number | null;

  @Field({ nullable: true })
  @Column({ nullable: true })
  fuelType: string | null;

  @Field({ nullable: true })
  @Column({ nullable: true })
  roadSpeed: number | null;

  @Field({ nullable: true })
  @Column({ nullable: true })
  engine: string | null;

  @Field({ nullable: true })
  @Column({ nullable: true })
  engineSerialNumber: number | null;

  @Field({ nullable: true })
  @Column({ nullable: true })
  transmission: string | null;

  @Field({ nullable: true })
  @Column({ nullable: true })
  transmissionSerialNumber: number | null;

  @Field({ nullable: true })
  @Column({ nullable: true })
  lengthCm: number | null;

  @Field({ nullable: true })
  @Column({ nullable: true })
  widthCm: number | null;

  @Field({ nullable: true })
  @Column({ nullable: true })
  heightCm: number | null;

  @Field((type) => PneumaticTypeEnum, { nullable: true })
  @Column({ nullable: true })
  pneumaticType1: string | null;

  @Field({ nullable: true })
  @Column({ nullable: true })
  pneumaticQuantity1: number | null;

  @Field((type) => PneumaticTypeEnum, { nullable: true })
  @Column({ nullable: true })
  pneumaticType2: string | null;

  @Field({ nullable: true })
  @Column({ nullable: true })
  pneumaticQuantity2: number | null;

  @Field((type) => CritAirEnum, { nullable: true })
  @Column({ nullable: true })
  critAirSticker: string | null;

  @Field((type) => TransmissionLubricantEnum, { nullable: true })
  @Column({ nullable: true })
  transmissionLubricantType: string | null;

  @Field({ nullable: true })
  @Column({ nullable: true })
  transmissionLubricantQuantity: number | null;

  @Field((type) => AxleLubricantEnum, { nullable: true })
  @Column({ nullable: true })
  axleLubricantType: string | null;

  @Field({ nullable: true })
  @Column({ nullable: true })
  axleLubricantQuantity: number | null;

  @Field((type) => EngineLubricantEnum, { nullable: true })
  @Column({ nullable: true })
  engineLubricantType: string | null;

  @Field({ nullable: true })
  @Column({ nullable: true })
  engineLubricantQuantity: number | null;

  @Field((type) => PowerSteeringLubricantEnum, { nullable: true })
  @Column({ nullable: true })
  powerSteeringLubricantType: string | null;

  @Field({ nullable: true })
  @Column({ nullable: true })
  powerSteeringLubricantQuantity: number | null;

  @Field((type) => HydraulicOilEnum, { nullable: true })
  @Column({ nullable: true })
  hydraulicOilType: string | null;

  @Field({ nullable: true })
  @Column({ nullable: true })
  hydraulicOilQuantity: number | null;
}
