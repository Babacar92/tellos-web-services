import { IsInt, IsNumber, IsOptional, IsString } from "class-validator";
import { DatabaseFilterArg } from "src/libs/databases/dto/args/database.filter.arg";

/**
 * Input for to filter a new CategoryEquipment
 */
export class CategoryEquipmentFilterEquipmentRateArgInput extends DatabaseFilterArg {
    /**
     * The target title for filter CategoryEquipment
     */
    @IsOptional()
    @IsString()
    public title?: string;

    /**
    * The target code for filter CategoryEquipment
    */
    @IsOptional()
    @IsString()
    public code?: string;

    /**
    * The target code for filter CategoryEquipment
    */
    @IsOptional()
    @IsString({
        each: true,
    })
    public codes?: String[];

    /**
     * the target price for filter CategoryEquipment
     */
    @IsOptional()
    @IsNumber()
    public price: number;

    /**
     * The entity id
     */
    @IsOptional()
    @IsInt()
    public entity?: number;

}