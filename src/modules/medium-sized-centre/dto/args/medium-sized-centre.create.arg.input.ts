import { IsBoolean, IsInt, IsOptional, IsString, Validate } from "class-validator";
import { MediumSizedCentreNotExistByColumnConstraint } from "../../constraints/medium-sized-centre.not.exist.by.column.constraints";
import { Transform } from "class-transformer";

/**
 * Input for to create a new Quick Access
 */
export class MediumSizedCentreCreateArgInput {

    /**
     * The code of MediumSizedCentre
     */
    @IsString()
    @Validate(MediumSizedCentreNotExistByColumnConstraint, {

    })
    public code: string;

    /**
     * The label of MediumSizedCentre
     */
    @IsString()
    @Transform(({ value }) => value ? value : null)
    public label?: string;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active: boolean = true;

}