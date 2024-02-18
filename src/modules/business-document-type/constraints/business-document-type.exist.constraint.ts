import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { TranslationService } from "../../../libs/translation/service/translation.service";
import { BusinessDocumentTypeService } from "../service/business-document-type.service";


@ValidatorConstraint({
    name: 'BusinessDocumentTypeExistConstraint',
    async: true
})
@Injectable()
export class BusinessDocumentTypeExistConstraint implements ValidatorConstraintInterface {

    public constructor(
        private readonly _service: BusinessDocumentTypeService,
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

        return this._translationService.trans('One or more selected Business document type doesn\'t exist', {
            value: value,
        }, domain).getValue();
    }

}