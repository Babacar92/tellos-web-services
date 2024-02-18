import { Transform } from "class-transformer";
import { IsDate, IsInt, IsOptional } from "class-validator";
import { DatabaseFilterArg } from "src/libs/databases/dto/args/database.filter.arg";

/**
 * Input for to filter a new EquipmentDocument
 */
export class EquipmentDocumentFilterArgInput extends DatabaseFilterArg {

    /**
     * The employe id
     */
    @IsOptional()
    @IsInt()
    public employeeId?: number;

    /**
     * The employees id
     */
    @IsOptional()
    @IsInt()
    public employeeIds?: number[];

    /**
     * DocumentType id
     */
    @IsOptional()
    @IsInt()
    public documentTypeId?: number;

    /**
     * DocumentType id
     */
    @IsOptional()
    @IsInt()
    public documentTypeIds?: number[];

    /**
     * The target startDate for filter
     */
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public startDate?: Date;

    /**
     * The target endDate for filter
     */
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public endDate?: Date;

}