import { IsBoolean, IsOptional, IsString, Validate } from "class-validator";
import { QualificationTypeNotExistByColumnConstraint } from "../../constraints/qualification-type.not.exist.by.column.constraints";

/**
 * Input for to create a new Quick Access
 */
export class QualificationTypeCreateArgInput {

    /**
     * The name of Qualification Name
     */
    @IsString()
    @Validate(QualificationTypeNotExistByColumnConstraint, {

    })
    public name: string;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active: boolean = true;

}