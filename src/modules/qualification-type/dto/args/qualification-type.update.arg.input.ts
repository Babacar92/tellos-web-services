import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Validate } from "class-validator";
import { QualificationTypeNotExistByColumnConstraint } from "../../constraints/qualification-type.not.exist.by.column.constraints";
import { QualificationTypeExistConstraint } from "../../constraints/qualification-type.exist.constraint";

/**
 * Input for to update a new Quick Access
 */
export class QualificationTypeUpdateArgInput {

    /**
     * The id of Quick Access
     */
    @IsNotEmpty()
    @Validate(QualificationTypeExistConstraint, {

    })
    public id: number;

    /**
     * The name of Qualification Name
     */
    @IsOptional()
    @IsString()
    @Validate(QualificationTypeNotExistByColumnConstraint, {

    })
    public name: string;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean;

}