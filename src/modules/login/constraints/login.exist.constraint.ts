import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { TranslationService } from "../../../libs/translation/service/translation.service";
import { LoginService } from "../service/login.service";


@ValidatorConstraint({
    name: 'LoginExistConstraint',
    async: true
})
@Injectable()
export class LoginExistConstraint implements ValidatorConstraintInterface {

    public constructor(
        private readonly _loginService: LoginService,
        private readonly _translationService: TranslationService,
    ) { }

    public async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
        return this._loginService.exist(value);
    }

    public defaultMessage?(validationArguments?: ValidationArguments): string {
        const {
            property, value
        } = validationArguments;

        const domain = 'validation';

        return this._translationService.trans("The user login doesn't exist", {
            value: value,
        }, domain).getValue();
    }

}