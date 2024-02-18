import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Validate } from "class-validator";
import { TheoreticalHoursOfUseExistConstraint } from "../../constraints/theoretical-hours-of-use.exist.constraint";

/**
 * Input for to update a new Quick Access
 */
export class TheoreticalHoursOfUseUpdateArgInput {

    /**
     * The id of Quick Access
     */
    @IsNotEmpty()
    @Validate(TheoreticalHoursOfUseExistConstraint, {

    })
    public id: number;

    /**
     * number of hours of theoretical hours of use
     */
    @IsNumber()
    public hoursNumber?: number;

    /**
   * year of theoretical hours of use
   */
    @IsOptional()
    @IsString()
    public year?: string;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean;

}