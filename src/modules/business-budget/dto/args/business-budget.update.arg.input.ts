import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Validate } from "class-validator";
import { BusinessBudgetExistConstraint } from "../../constraints/business-budget.exist.constraint";
import { BusinessExistConstraint } from "../../../business/constraints/business.exist.constraint";
import { Transform } from "class-transformer";
import { BusinessEntity } from "../../../../entities/psql/BusinessEntity";
import { EntityEntity } from "../../../../entities/psql/EntityEntity";
import { EntityExistConstraint } from "../../../entity/constraints/entity.exist.constraint";

/**
 * Input for to update a new Quick Access
 */
export class BusinessBudgetUpdateArgInput {

    /**
     * The id of Quick Access
     */
    @IsNotEmpty()
    @Validate(BusinessBudgetExistConstraint, {

    })
    public id: number;

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
    public active?: boolean;

}