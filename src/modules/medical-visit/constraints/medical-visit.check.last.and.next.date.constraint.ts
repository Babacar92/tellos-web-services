import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { TranslationService } from "../../../libs/translation/service/translation.service";


@ValidatorConstraint({
    name: 'MedicalVisitCheckLastAndNextDateConstraint',
    async: true
})
@Injectable()
export class MedicalVisitCheckLastAndNextDateConstraint implements ValidatorConstraintInterface {

    public constructor(
        private readonly _translationService: TranslationService,
    ) { }

    public async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
        const lastDateMedicalVisit = validationArguments.object['lastDateMedicalVisit'];
        if (value && lastDateMedicalVisit) {
            return lastDateMedicalVisit < value;
        }
        return true;
    }

    public defaultMessage?(validationArguments?: ValidationArguments): string {
        const {
            property, value
        } = validationArguments;

        const domain = 'validation';

        return this._translationService.trans('The next date of medical visit must be greater than and different from the last date of medical visit', {
            value: value,
        }, domain).getValue();
    }

}