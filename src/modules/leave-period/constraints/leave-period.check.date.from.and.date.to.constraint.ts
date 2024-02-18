import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { TranslationService } from "../../../libs/translation/service/translation.service";


@ValidatorConstraint({
    name: 'LeavePeriodCheckDateFromAndDateToConstraint',
    async: true
})
@Injectable()
export class LeavePeriodCheckDateFromAndDateToConstraint implements ValidatorConstraintInterface {

    public constructor(
        private readonly _translationService: TranslationService,
    ) { }

    public async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
        const dateFrom = validationArguments.object['dateFrom'];
        if (value && dateFrom) {
            return dateFrom < value;
        }
        return true;
    }

    public defaultMessage?(validationArguments?: ValidationArguments): string {
        const {
            property, value
        } = validationArguments;

        const domain = 'validation';

        return this._translationService.trans('The date to must be greater than and different from the date from', {
            value: value,
        }, domain).getValue();
    }

}