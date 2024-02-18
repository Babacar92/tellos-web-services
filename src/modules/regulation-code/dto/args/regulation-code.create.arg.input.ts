import { IsBoolean, IsInt, IsOptional, IsString } from "class-validator";

/**
 * Input for to create a new Quick Access
 */
export class RegulationCodeCreateArgInput {

    /**
     * The code of Regulation code
     */
    @IsString()
    public code: string;

    /**
     * The title of Regulation code
     */
    @IsString()
    public title: string;

    /**
     * The immediateDays of Regulation code
     */
    @IsOptional()
    @IsInt()
    public immediateDays?: number;

    /**
     * The paymentDays of Regulation code
     */
    @IsOptional()
    @IsInt()
    public paymentDays?: number;

    /**
     * The additionnalDays of Regulation code
     */
    @IsOptional()
    @IsInt()
    public additionnalDays?: number;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public specificity?: boolean;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active: boolean = true;

}