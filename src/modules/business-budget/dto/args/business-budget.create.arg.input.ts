import { IsBoolean, IsNumber, IsOptional, IsString, Validate } from "class-validator";
import { BusinessExistConstraint } from "../../../business/constraints/business.exist.constraint";
import { Transform } from "class-transformer";
import { BusinessEntity } from "../../../../entities/psql/BusinessEntity";
import { EntityExistConstraint } from "../../../entity/constraints/entity.exist.constraint";
import { EntityEntity } from "../../../../entities/psql/EntityEntity";

/**
 * Input for to create a new Quick Access
 */
export class BusinessBudgetCreateArgInput {

    /**
     * The entity
     */
    @IsOptional()
    @Validate(EntityExistConstraint, {

    })
    @Transform(({ value }) => EntityEntity.init(value))
    public entity?: EntityEntity;

    /**
     * The business
     */
    @IsOptional()
    @Validate(BusinessExistConstraint, {

    })
    @Transform(({ value }) => BusinessEntity.init(value))
    public business?: BusinessEntity;

    /**
     * The work
     */
    @IsOptional()
    @IsString()
    public work?: string;

    /**
     * The htPrice
     */
    @IsOptional()
    @IsNumber()
    public htPrice?: number;

    /**
     * The margin
     */
    @IsOptional()
    @IsNumber()
    public margin?: number;

    /**
     * The htMargin
     */
    @IsOptional()
    @IsNumber()
    public htMargin?: number;

    /**
     * The htTotal
     */
    @IsOptional()
    @IsNumber()
    public htTotal?: number;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active: boolean = true;

}