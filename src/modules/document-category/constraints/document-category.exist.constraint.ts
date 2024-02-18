import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { TranslationService } from "../../../libs/translation/service/translation.service";
import { DocumentCategoryService } from "../service/document-category.service";


@ValidatorConstraint({
    name: 'DocumentCategoryExistConstraint',
    async: true
})
@Injectable()
export class DocumentCategoryExistConstraint implements ValidatorConstraintInterface {

    public constructor(
        private readonly _service: DocumentCategoryService,
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

        return this._translationService.trans('One or more selected Document Tag doesn\'t exist', {
            value: value,
        }, domain).getValue();
    }

}