import { IsDate, IsEnum, IsInt, IsOptional, IsString, Validate } from "class-validator";
import { DatabaseFilterArg } from "src/libs/databases/dto/args/database.filter.arg";
import { AvailableEnum } from "../enums/equipment.available.enum";
import { Transform } from "class-transformer";

/**
 * Input for to filter a new a Equipment
 */
export class EquipmentFilterArgInput extends DatabaseFilterArg {

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
    * The employe id
   */
    @IsOptional()
    @IsInt()
    public categorieId?: number;

    /**
     * The employees id
    */
    @IsOptional()
    @IsInt()
    public categorieIds?: number[];

    /**
     * The employe id
    */
    @IsOptional()
    @IsInt()
    public entityId?: number;

    /**
     * The employees id
    */
    @IsOptional()
    @IsInt()
    public entityIds?: number[];

    /**
     * available
     */
    @IsOptional()
    @IsEnum(AvailableEnum, {

    })
    public available?: AvailableEnum;

    /**
     * List of availables of Equipment
     */
    @IsOptional()
    @IsEnum(AvailableEnum, {
        each: true,
    })
    public availables?: AvailableEnum[];

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