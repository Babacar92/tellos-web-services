import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Validate } from "class-validator";
import { MediumSizedCentreNotExistByColumnConstraint } from "../../constraints/medium-sized-centre.not.exist.by.column.constraints";
import { MediumSizedCentreExistConstraint } from "../../constraints/medium-sized-centre.exist.constraint";
import { Transform } from "class-transformer";

/**
 * Input for to update a new Quick Access
 */
export class MediumSizedCentreUpdateArgInput {

    /**
     * The id of Quick Access
     */
    @IsNotEmpty()
    @Validate(MediumSizedCentreExistConstraint, {

    })
    public id: number;

    /**
     * The code of MediumSizedCentre
     */
    @IsOptional()
    @IsString()
    @Validate(MediumSizedCentreNotExistByColumnConstraint, {

    })
    public code: string;

    /**
     * The name of MediumSizedCentre
     */
    @IsOptional()
    @IsString()
    @Transform(({ value }) => value ? value : null)
    public label: string;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean;

}