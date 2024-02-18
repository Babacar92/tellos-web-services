import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { TiresTypeEnum } from '../../enums/tire-type.enum';
import { EquipmentTechnicalGenre } from '@/entities/psql/equipment-technical-genre.entity';
import { EquipmentPark } from '@/entities/psql/equipment-park.entity';
import {
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    Validate,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { EquipmentParkExistConstraint } from '../../equipment-park/equipment-park.exist.constraint';
import { EquipmentTechnicalThumbnail } from '@/entities/psql/equipment-technical-thumbnail.entity';

import { EquipmentTechnicalThumbnailExistConstraint } from '@/modules/equipment-technical-thumbnail/constraints/equipment-technical-thumbnail.exist.constraint';
import { EquipmentTechnicalGenreExistConstraint } from '@/modules/equipment-technical-genre/constraints/equipment-technical-genre.exist.constraint';
import { Good } from '@Entities/good.entity';
import { GoodExistConstraint } from '@/modules/good/constraints/good.exist.constraint';

@InputType()
export class UpdateEquipmentTechnicalInput {
    @Validate(EquipmentParkExistConstraint, {})
    @Transform(({ value }) => EquipmentPark.init(value))
    @Field((type) => Int)
    equipmentPark!: EquipmentPark;

    @IsOptional()
    @IsEnum(TiresTypeEnum)
    @Field((type) => TiresTypeEnum, { nullable: true })
    tiresType?: TiresTypeEnum;

    @IsOptional()
    @IsNumber()
    @Field((type) => Float, { nullable: true })
    tonnage?: number;

    @IsOptional()
    @Validate(EquipmentTechnicalGenreExistConstraint, {})
    @Transform(({ value }) => EquipmentTechnicalGenre.init(value))
    @Field((type) => Int, { nullable: true })
    genre?: EquipmentTechnicalGenre;

    @IsOptional()
    @Validate(EquipmentTechnicalThumbnailExistConstraint, {})
    @Transform(({ value }) => EquipmentTechnicalThumbnail.init(value))
    @Field((type) => Int, { nullable: true })
    thumbnailCritAir?: EquipmentTechnicalThumbnail;

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    brand?: string;

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    type?: string;

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    series?: string;

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    sheetMetal?: string;

    @IsOptional()
    @IsNumber()
    @Field((type) => Float, { nullable: true })
    power?: number;

    @IsOptional()
    @IsNumber()
    @Field((type) => Int, { nullable: true })
    seats?: number;

    @IsOptional()
    @IsNumber()
    @Field((type) => Float, { nullable: true })
    consumption?: number;

    @IsOptional()
    @IsNumber()
    @Field((type) => Float, { nullable: true })
    ptac?: number;

    @IsOptional()
    @IsNumber()
    @Field((type) => Float, { nullable: true })
    pv?: number;

    @IsOptional()
    @IsNumber()
    @Field((type) => Float, { nullable: true })
    ptra?: number;

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    energy?: string;

    @IsOptional()
    @IsNumber()
    @Field({ nullable: true })
    roadSpeed?: number;

    @IsOptional()
    @IsString()
    @Field((type) => Float, { nullable: true })
    engine?: string;

    @IsOptional()
    @IsString()
    @Field((type) => String, { nullable: true })
    engineSerialNumber?: string;

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    box?: string;

    @IsOptional()
    @IsString()
    @Field((type) => String, { nullable: true })
    boxSerialNumber?: string;

    @IsOptional()
    @IsNumber()
    @Field((type) => Float, { nullable: true })
    length?: number;

    @IsOptional()
    @IsNumber()
    @Field((type) => Float, { nullable: true })
    width?: number;

    @IsOptional()
    @IsNumber()
    @Field((type) => Float, { nullable: true })
    height?: number;

    @IsOptional()
    @Validate(GoodExistConstraint, {})
    @Transform(({ value }) => Good.init(value))
    @Field((type) => Int, { nullable: true })
    pneumaticTypeOne?: Good;

    @IsOptional()
    @IsNumber()
    @Field((type) => Float, { nullable: true })
    quantityOne?: number;

    @IsOptional()
    @Validate(GoodExistConstraint, {})
    @Transform(({ value }) => Good.init(value))
    @Field((type) => Int, { nullable: true })
    pneumaticTypeTwo?: Good;

    @IsOptional()
    @IsNumber()
    @Field((type) => Float, { nullable: true })
    quantityTwo?: number;

    @IsOptional()
    @Validate(GoodExistConstraint, {})
    @Transform(({ value }) => Good.init(value))
    @Field((type) => Int, { nullable: true })
    gearboxLubricantType?: Good;

    @IsOptional()
    @IsNumber()
    @Field((type) => Float, { nullable: true })
    gearboxLubricantQuantity?: number;

    @IsOptional()
    @Validate(GoodExistConstraint, {})
    @Transform(({ value }) => Good.init(value))
    @Field((type) => Int, { nullable: true })
    bridgeLubricantType?: Good;

    @IsOptional()
    @IsNumber()
    @Field((type) => Float, { nullable: true })
    bridgeLubricantQuantity?: number;

    @IsOptional()
    @Validate(GoodExistConstraint, {})
    @Transform(({ value }) => Good.init(value))
    @Field((type) => Int, { nullable: true })
    engineLubricantType?: Good;

    @IsOptional()
    @IsNumber()
    @Field((type) => Float, { nullable: true })
    engineLubricantQuantity?: number;

    @IsOptional()
    @Validate(GoodExistConstraint, {})
    @Transform(({ value }) => Good.init(value))
    @Field((type) => Int, { nullable: true })
    daLubricantType?: Good;

    @IsOptional()
    @IsNumber()
    @Field((type) => Float, { nullable: true })
    daLubricantQuantity?: number;

    @IsOptional()
    @Validate(GoodExistConstraint, {})
    @Transform(({ value }) => Good.init(value))
    @Field((type) => Int, { nullable: true })
    hydrolicOilType?: Good;

    @IsOptional()
    @IsNumber()
    @Field((type) => Float, { nullable: true })
    hydrolicOilQuantity?: number;
}
