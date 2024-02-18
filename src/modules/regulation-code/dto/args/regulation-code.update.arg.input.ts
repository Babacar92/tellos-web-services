import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Validate } from "class-validator";
import { RegulationCodeExistConstraint } from "../../constraints/regulation-code.exist.constraint";

/**
 * Input for to update a new Quick Access
 */
export class RegulationCodeUpdateArgInput {

    /**
     * The id of Quick Access
     */
    @IsNotEmpty()
    @Validate(RegulationCodeExistConstraint, {

    })
    public id: number;

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
    public active?: boolean;

}