import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { TranslationService } from "../../../libs/translation/service/translation.service";
import { ContractTypeEntryService } from "../service/contract-type-entry.service";


@ValidatorConstraint({
    name: 'ContractTypeEntryExistConstraint',
    async: true
})
@Injectable()
export class ContractTypeEntryExistConstraint implements ValidatorConstraintInterface {

    public constructor(
        private readonly _service: ContractTypeEntryService,
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

        return this._translationService.trans('One or more selected Employee Contract Type Entry doesn\'t exist', {
            value: value,
        }, domain).getValue();
    }

}