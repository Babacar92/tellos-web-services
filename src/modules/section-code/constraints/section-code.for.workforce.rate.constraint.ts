import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { TranslationService } from "../../../libs/translation/service/translation.service";
import { SectionCodeService } from "../service/section-code.service";


@ValidatorConstraint({
    name: 'SectionCodeForWorkforceRateConstraint',
    async: true
})
@Injectable()
export class SectionCodeForWorkforceRateConstraint implements ValidatorConstraintInterface {

    public constructor(
        private readonly _service: SectionCodeService,
        private readonly _translationService: TranslationService,
    ) { }

    public async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
        return this._service.isAvailableForWorkforceRate(value);
    }

    public defaultMessage?(validationArguments?: ValidationArguments): string {
        const {
            property, value
        } = validationArguments;

        const domain = 'validation';

        return this._translationService.trans('One or more selected Section Code is not child of the WorkForce expense post', {
            value: value,
        }, domain).getValue();
    }

}