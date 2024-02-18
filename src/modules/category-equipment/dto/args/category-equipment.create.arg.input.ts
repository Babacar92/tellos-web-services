import { Transform } from 'class-transformer';
import {
    IsBoolean,
    IsNumber,
    IsOptional,
    IsString,
    Validate,
} from 'class-validator';
import { MediumSizedCentreEntity } from 'src/entities/psql/MediumSizedCentreEntity';
import { MediumSizedCentreExistConstraint } from 'src/modules/medium-sized-centre/constraints/medium-sized-centre.exist.constraint';
import { Field, InputType, Int } from '@nestjs/graphql';

/**
 * Input for to create a new Category Equipment
 */
@InputType()
export class CategoryEquipmentCreateArgInput {
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
    @IsOptional()
    @Validate(MediumSizedCentreExistConstraint, {})
    @Transform(({ value }) => MediumSizedCentreEntity.init(value))
    @Field((type) => Int, { nullable: true })
    public mediumSizedCentre?: MediumSizedCentreEntity;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    @Field()
    public active = true;

    @IsString()
    @Field()
    code: string;
}
