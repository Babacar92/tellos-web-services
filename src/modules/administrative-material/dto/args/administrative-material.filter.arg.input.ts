import { Transform } from "class-transformer";
import { IsDate, IsEnum, IsInt, IsOptional, IsString, Validate } from "class-validator";
import { DatabaseFilterArg } from "src/libs/databases/dto/args/database.filter.arg";
import { FinancingEnum } from "../enums/administrative-material-financing.enum";
import { EntityExistByColumnConstraint } from "src/modules/entity/constraints/entity.exist.by.column.constraints";

/**
 * Input for to filter a new Quick Access
 */
export class AdministrativeMaterialFilterArgInput extends DatabaseFilterArg {

    /**
     * The typeOfSale
     */
    @IsOptional()
    @IsString()
    public comment?: string;

    /**
    * The target names for filter
    */
    @IsOptional()
    @IsString({
        each: true,
    })
    public comments?: string[];

    /**
      * contract Start Date
      */
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public contractStartDate?: Date;

    /**
      * contract contract End Date
      */
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public contractEndDate?: Date;

    /**
      * contract contract End Date
      */
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public saleDate?: Date;
}