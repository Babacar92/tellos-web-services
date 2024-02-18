import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { TranslationService } from "../../../libs/translation/service/translation.service";


@ValidatorConstraint({
    name: 'LeaveCheckStartAndEndDateConstraint',
    async: true
})
@Injectable()
export class LeaveCheckStartAndEndDateConstraint implements ValidatorConstraintInterface {

    public constructor(
        private readonly _translationService: TranslationService,
    ) { }

    public async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
        const startDate = validationArguments.object['startDate'];
        if (value && startDate) {
            return startDate <= value;
        }
        return true;
    }

    public defaultMessage?(validationArguments?: ValidationArguments): string {
        const {
            property, value
        } = validationArguments;

        const domain = 'validation';

        return this._translationService.trans('The end date must be greater than and different from the start date', {
            value: value,
        }, domain).getValue();
    }

}