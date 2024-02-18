import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { TranslationService } from "../../../libs/translation/service/translation.service";
import { QualificationNameService } from "../service/qualification-name.service";


@ValidatorConstraint({
    name: 'QualificationNameExistConstraint',
    async: true
})
@Injectable()
export class QualificationNameExistConstraint implements ValidatorConstraintInterface {

    public constructor(
        private readonly _service: QualificationNameService,
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