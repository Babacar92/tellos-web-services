import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { TranslationService } from "../../../libs/translation/service/translation.service";
import { QuickAccessService } from "../services/quick-access.service";


@ValidatorConstraint({
    name: 'QuickAccessExistConstraint',
    async: true
})
@Injectable()
export class QuickAccessExistConstraint implements ValidatorConstraintInterface {

    public constructor(
        private readonly _quickaccessService: QuickAccessService,
        private readonly _translationService: TranslationService,
    ) { }

    public async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
        return this._quickaccessService.exist(value);
    }

    public defaultMessage?(validationArguments?: ValidationArguments): string {
        const {
            property, value
        } = validationArguments;

        const domain = 'validation';

        return this._translationService.trans('One or more selected QuickAccess doesn\'t exist', {
            value: value,
        }, domain).getValue();
    }

}