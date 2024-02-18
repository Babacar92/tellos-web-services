import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { TranslationService } from "../../../libs/translation/service/translation.service";
import { PermissionService } from "../services/permission.service";
import { dump } from "../../../utils/utils";


@ValidatorConstraint({
    name: 'PermissionExistConstraint',
    async: true
})
@Injectable()
export class PermissionExistConstraint implements ValidatorConstraintInterface {

    public constructor(
        private readonly _permissionService: PermissionService,
        private readonly _translationService: TranslationService,
    ) { }

    public async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
        return this._permissionService.exist(value);
    }

    public defaultMessage?(validationArguments?: ValidationArguments): string {
        const {
            property, value
        } = validationArguments;

        const domain = 'validation';

        return this._translationService.trans('One or more selected Permission doesn\'t exist', {
            value: value,
        }, domain).getValue();
    }

}