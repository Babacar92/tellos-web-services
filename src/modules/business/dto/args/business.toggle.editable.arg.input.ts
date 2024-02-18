import { IsBoolean, IsNotEmpty, Validate } from "class-validator";
import { BusinessExistConstraint } from "../../constraints/business.exist.constraint";

/**
 * Input for to create a new Quick Access
 */
export class BusinessToggleEditableArgInput {

    /**
     * The id of Quick Access
     */
    @IsNotEmpty()
    @Validate(BusinessExistConstraint, {

    })
    public id: number;

    /**
     * The value
     */
    @IsBoolean()
    public value: boolean;

}