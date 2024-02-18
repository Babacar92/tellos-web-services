import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { TranslationService } from "../../../libs/translation/service/translation.service";
import { TokenService } from "../../token/service/token.service";


@ValidatorConstraint({
    name: 'LoginIsValidTokenConstraint',
    async: true
})
@Injectable()
export class LoginIsValidTokenConstraint implements ValidatorConstraintInterface {

    public constructor(
        private readonly _tokenService: TokenService,
        private readonly _translationService: TranslationService,
    ) { }

    public async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
        return this._tokenService.isValid(value);
    }

    public defaultMessage?(validationArguments?: ValidationArguments): string {
        const {
            property, value
        } = validationArguments;

        const domain = 'validation';

        return this._translationService.trans("The token isn't valid", {
            value: value,
        }, domain).getValue();
    }

}