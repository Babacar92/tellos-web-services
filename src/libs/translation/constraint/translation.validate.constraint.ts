import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { TranslationService } from "../service/translation.service";

/**
 * Constraint to check if upload exist
 */
@ValidatorConstraint({
    name: 'TranslationValidateConstraint',
    async: true,
})
@Injectable()
export class TranslationValidateConstraint implements ValidatorConstraintInterface {

    public constructor(
        private readonly _service: TranslationService,
    ) { }

    public async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
        return this._service.validate(value);
    }


    public defaultMessage?(validationArguments?: ValidationArguments): string {
        return this._service
            .trans('The translation request is invalid', null, 'validation')
            .getValue();
    }

}