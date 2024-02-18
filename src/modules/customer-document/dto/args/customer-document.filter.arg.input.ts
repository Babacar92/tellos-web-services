import { Transform } from "class-transformer";
import { IsDate, IsInt, IsOptional } from "class-validator";
import { DatabaseFilterArg } from "src/libs/databases/dto/args/database.filter.arg";

/**
 * Input for to filter a new Quick Access
 */
export class CustomerDocumentFilterArgInput extends DatabaseFilterArg {

    /**
     * The target customer id
     */
    @IsOptional()
    @IsInt()
    public customerId?: number;

    /**
     * The target customer id
     */
    @IsOptional()
    @IsInt({
        each: true,
    })
    public customerIds?: number[];

    /**
     * dateFrom
     */
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public dateFrom?: Date;

    /**
     * dateTo
     */
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public dateTo?: Date;

    /**
     * Employe ids
     */
    @IsOptional()
    @IsInt({
        each: true,
    })
    public employeeIds?: number[];

}