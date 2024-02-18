import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { TranslationService } from "../../../libs/translation/service/translation.service";
import { LoginPermissionService } from "../service/login-permission.service";


@ValidatorConstraint({
    name: 'LoginPermissionExistConstraint',
    async: true
})
@Injectable()
export class LoginPermissionExistConstraint implements ValidatorConstraintInterface {

    public constructor(
        private readonly _service: LoginPermissionService,
        private readonly _translationService: TranslationService,
    ) { }

    public async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
        return this._service.exist(value);
    }

    public defaultMessage?(validationArguments?: ValidationArguments): string {
        const {
            property, value
        } = validationArguments;

        const domain = 'validation';

        return this._translationService.trans('One or more selected login permission doesn\'t exist', {
            value: value,
        }, domain).getValue();
    }

}