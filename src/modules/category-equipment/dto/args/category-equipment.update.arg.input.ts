import {
    IsBoolean,
    IsNotEmpty,
    IsOptional,
    IsString,
    Validate,
} from 'class-validator';
import { CategoryEquipmentExistConstraint } from '../../constraints/category-equipment.exist.constraint';
import { MediumSizedCentreExistConstraint } from 'src/modules/medium-sized-centre/constraints/medium-sized-centre.exist.constraint';
import { MediumSizedCentreEntity } from 'src/entities/psql/MediumSizedCentreEntity';
import { Transform } from 'class-transformer';
import { Field, InputType, Int } from '@nestjs/graphql';

/**
 * Input for to update a CategoryEquipment
 */
@InputType()
export class CategoryEquipmentUpdateArgInput {
    /**
     * The id of Category Equipment
     */
    @IsNotEmpty()
    @Validate(CategoryEquipmentExistConstraint, {})
    @Field((type) => Int)
    public id: number;

    /**
     * title of Category Equipment
     */
    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    public title?: string;

    /**
     * medium size center of category equipment
     */
    @Validate(MediumSizedCentreExistConstraint, {})
    @IsOptional()
    @Transform(({ value }) => MediumSizedCentreEntity.init(value))
    @Field((type) => Int, { nullable: true })
    public mediumSizedCentre?: MediumSizedCentreEntity;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    @Field({ nullable: true })
    public active?: boolean;

    @IsOptional()
    @IsString()
    @Field({ nullable: true })
    code?: string;
}
