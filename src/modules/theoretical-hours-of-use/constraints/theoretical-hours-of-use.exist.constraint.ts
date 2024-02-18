import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { TranslationService } from "../../../libs/translation/service/translation.service";
import { TheoreticalHoursOfUseService } from "../service/theoretical-hours-of-use.service";


@ValidatorConstraint({
    name: 'TheoreticalHoursOfUseExistConstraint',
    async: true
})
@Injectable()
export class TheoreticalHoursOfUseExistConstraint implements ValidatorConstraintInterface {

    public constructor(
        private readonly _service: TheoreticalHoursOfUseService,
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

        return this._translationService.trans('One or more selected Qualification name doesn\'t exist', {
            value: value,
        }, domain).getValue();
    }

}