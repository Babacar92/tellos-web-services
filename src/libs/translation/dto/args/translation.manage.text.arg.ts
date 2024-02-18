import { IsNotEmpty, Validate } from "class-validator";
import { TranslationValidateConstraint } from "../../constraint/translation.validate.constraint";
import { TranslationTextFrontInterface } from "../interfaces/controller.interfaces";

/**
 * Text manage Args
 */
export class TranslationManageTextArg {

    /**
     * Text of request
     */
    @IsNotEmpty()
    @Validate(TranslationValidateConstraint)
    text: TranslationTextFrontInterface;
}