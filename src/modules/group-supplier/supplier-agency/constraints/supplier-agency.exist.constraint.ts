import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { TranslationService } from "@Libs/translation/service/translation.service";
import { SupplierAgencyService } from "../supplier-agency.service";


@ValidatorConstraint({
    name: 'SupplierAgencyExistConstraint',
    async: true
})
@Injectable()
export class SupplierAgencyExistConstraint implements ValidatorConstraintInterface {

    public constructor(
        private readonly _service: SupplierAgencyService,
        private readonly _translationService: TranslationService,
    ) { }

    public async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
        return await this._service.exist(value);
    }

    public defaultMessage?(validationArguments?: ValidationArguments): string {
        const {
            property, value
        } = validationArguments;

        const domain = 'validation';

        return this._translationService.trans('One or more selected supplier agency doesn\'t exist', {
            value: value,
        }, domain).getValue();
    }

}