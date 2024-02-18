import { IsDate, IsInt, IsOptional, IsString } from "class-validator";
import { DatabaseFilterArg } from "src/libs/databases/dto/args/database.filter.arg";


export class LeavePeriodFilterArgInput extends DatabaseFilterArg {

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
     * Date From filter target
     */
    @IsOptional()
    @IsDate()
    public dateFrom?: Date

    /**
     * Date To filter target
     */
    @IsOptional()
    @IsDate()
    public dateTo?: Date

}