import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { TranslationService } from "src/libs/translation/service/translation.service";
import { QualificationService } from "../service/qualification.service";


@ValidatorConstraint({
    name: 'QualificationExistByColumnConstraint',
    async: true
})
@Injectable()
export class QualificationExistByColumnConstraint implements ValidatorConstraintInterface {

    public constructor(
        private readonly _service: QualificationService,
        private readonly _translationService: TranslationService,
    ) { }

    public async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            const res = await this._service.existByColumn(
                value,
                validationArguments.constraints ? validationArguments.constraints[0] : validationArguments.property,
                validationArguments.object['id'],
            );

            resolve(res);
        });
    }

    public defaultMessage?(validationArguments?: ValidationArguments): string {
        const {
            property, value
        } = validationArguments;

        const domain = 'validation';

        if (property === 'name') {
            return this._translationService.trans('The name {value} doesn\'t exist', {
                value: value,
            }, domain).getValue();
        } else if (property === 'number') {
            return this._translationService.trans('The number {value} doesn\'t exist', {
                value: value,
            }, domain).getValue();
        } else if (property === 'documentName') {
            return this._translationService.trans('The document with name {value} doesn\'t exist', {
                value: value,
            }, domain).getValue();
        }

        return this._translationService.trans('Value doesn\'t exist', {
            value: value,
        }, domain).getValue();
    }

}