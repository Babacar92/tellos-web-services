import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { TranslationService } from "../../../libs/translation/service/translation.service";


@ValidatorConstraint({
    name: 'ContractInfoCheckStartAndEndDateConstraint',
    async: true
})
@Injectable()
export class ContractInfoCheckStartAndEndDateConstraint implements ValidatorConstraintInterface {

    public constructor(
        private readonly _translationService: TranslationService,
    ) { }

    public async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
        const entryDate = validationArguments.object['entryDate'];
        if (value && entryDate) {
            return entryDate <= value;
        }
        return true;
    }

    public defaultMessage?(validationArguments?: ValidationArguments): string {
        const {
            property, value
        } = validationArguments;

        const domain = 'validation';

        return this._translationService.trans('The seniority date must be greater or equal from the entry date', {
            value: value,
        }, domain).getValue();
    }

}