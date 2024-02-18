import { IsEnum, IsOptional, IsString, Validate } from 'class-validator';
import { Field, InputType, Int } from '@nestjs/graphql';
import { ConstructionSiteTypeEnum } from '../../enums/construction-site-type.enum';
import { EntityEntity } from '@/entities/psql/EntityEntity';
import { EntityExistConstraint } from '@/modules/entity/constraints/entity.exist.constraint';
import { Transform } from 'class-transformer';
import { ConstructionSite } from '@/entities/psql/construction-site.entity';

/**
 * Input for to create a new construction site
 */
@InputType()
export class ConstructionSiteCreateArgInput {
    @IsString()
    @Field()
    label: string;

    //
    @IsEnum(ConstructionSiteTypeEnum)
    @Field((type) => ConstructionSiteTypeEnum)
    type: ConstructionSiteTypeEnum;

    @Field((type) => Int)
    @Validate(EntityExistConstraint, {})
    @Transform(({ value }) => EntityEntity.init(value))
    entity: EntityEntity;

    @IsOptional()
    @Field((type) => Int)
    @Validate(EntityExistConstraint, {})
    @Transform(({ value }) => EntityEntity.init(value))
    from?: ConstructionSite;
}
