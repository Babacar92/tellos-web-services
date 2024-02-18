import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { TranslationService } from "@Libs/translation/service/translation.service";
import { SupplierEvaluationService } from "../supplier-evaluation.service";


@ValidatorConstraint({
    name: 'SupplierEvaluationExistConstraint',
    async: true
})
@Injectable()
export class SupplierEvaluationExistConstraint implements ValidatorConstraintInterface {

    public constructor(
        private readonly _service: SupplierEvaluationService,
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

        return this._translationService.trans('One or more selected supplier evaluation doesn\'t exist', {
            value: value,
        }, domain).getValue();
    }

}