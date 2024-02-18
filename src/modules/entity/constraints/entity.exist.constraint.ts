import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { TranslationService } from "../../../libs/translation/service/translation.service";
import { EntityService } from "../services/entity.service";


@ValidatorConstraint({
    name: 'EntityExistConstraint',
    async: true
})
@Injectable()
export class EntityExistConstraint implements ValidatorConstraintInterface {

    public constructor(
        private readonly _entityService: EntityService,
        private readonly _translationService: TranslationService,
    ) { }

    public async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
        return this._entityService.exist(value);
    }

    public defaultMessage?(validationArguments?: ValidationArguments): string {
        const {
            property, value
        } = validationArguments;

        const domain = 'validation';

        return this._translationService.trans('One or more selected Entity doesn\'t exist', {
            value: value,
        }, domain).getValue();
    }

}