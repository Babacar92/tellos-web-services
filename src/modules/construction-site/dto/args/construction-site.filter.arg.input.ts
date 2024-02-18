import { Field, InputType, Int } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsInt, IsOptional } from 'class-validator';
import { DatabaseFilterArg } from 'src/libs/databases/dto/args/database.filter.arg';
import { ConstructionSiteStatusEnum } from '../../enums/construction-site-status.enum';

/**
 * Input for to filter a new Quick Access
 */
@InputType()
export class ConstructionSiteFilterArgInput extends DatabaseFilterArg {
    @IsOptional()
    @IsInt()
    @Field((type) => Int)
    public entityId?: number;

    @IsOptional()
    @IsInt({
        each: true,
    })
    @Field((type) => [Int])
    public entityIds?: number[];

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public startDate?: Date;

    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public endDate?: Date;

    @IsOptional()
    @IsEnum(ConstructionSiteStatusEnum)
    status?: ConstructionSiteStatusEnum;
}
