import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { TranslationService } from "src/libs/translation/service/translation.service";
import { ContractInfoService } from "../service/contract-info.service";


@ValidatorConstraint({
    name: 'ContractInfoNotExistByColumnConstraint',
    async: true
})
@Injectable()
export class ContractInfoNotExistByColumnConstraint implements ValidatorConstraintInterface {

    public constructor(
        private readonly _service: ContractInfoService,
        private readonly _translationService: TranslationService,
    ) { }

    public async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            const res = await this._service.existByColumn(
                value,
                validationArguments.constraints ? validationArguments.constraints[0] : validationArguments.property,
                validationArguments.object['id'],
            );

            resolve(!res);
        });
    }

    public defaultMessage?(validationArguments?: ValidationArguments): string {
        const {
            property, value
        } = validationArguments;

        const domain = 'validation';

        if (property === 'name') {
            return this._translationService.trans('The name {value} already exist', {
                value: value,
            }, domain).getValue();
        } else if (property === 'fileName') {
            return this._translationService.trans('The number {value} already exist', {
                value: value,
            }, domain).getValue();
        }  else if (property === 'employee') {
            return this._translationService.trans('The username {value} already exist', {
                value: value,
            }, domain).getValue();
        }
        

        return this._translationService.trans('Value already exist', {
            value: value,
        }, domain).getValue();
    }
}