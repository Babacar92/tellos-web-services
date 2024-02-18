import { IsNotEmpty, IsString, Validate } from "class-validator";
import { PasswordValidate } from "../../../../libs/databases/decorators/validators/PasswordValidate";
import { LoginIsValidTokenConstraint } from "../../../login/constraints/login.is-valid.token.constraint";

/**
 * 
 */
export class EmployeeResetPasswordArgInput {

    /**
     * The valid employee login token
     */
    @IsNotEmpty()
    @IsString()
    @Validate(LoginIsValidTokenConstraint, {

    })
    public token: string;

    /**
     * The new employee password
     */
    @IsNotEmpty()
    @IsString()
    @PasswordValidate({
        minChar: 6,
        lowerCase: true,
        numberChar: true,
        specChar: true,
        upperCase: true,
    })
    public password: string;

}