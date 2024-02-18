import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { TranslationService } from "src/libs/translation/service/translation.service";
import { UploadService } from "../service/upload.service";

@ValidatorConstraint({
    name: 'UploadExistConstraint',
    async: true
})
@Injectable()
export class UploadExistConstraint implements ValidatorConstraintInterface {

    public constructor(
        private readonly _translationService: TranslationService,
        private readonly _service: UploadService,
    ) { }

    public async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
        return this._service.exist(value);
    }

    public defaultMessage?(validationArguments?: ValidationArguments): string {
        const {
            property, value
        } = validationArguments;

        const domain = 'validation';

        return this._translationService.trans('One or more selected Upload doesn\'t exist', {
            value: value,
        }, domain).getValue();
    }
}