import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { TranslationService } from "src/libs/translation/service/translation.service";
import { EntityService } from "../services/entity.service";


@ValidatorConstraint({
    name: 'EntityNotExistByColumnConstraint',
    async: true
})
@Injectable()
export class EntityNotExistByColumnConstraint implements ValidatorConstraintInterface {

    public constructor(
        private readonly _entityService: EntityService,
        private readonly _translationService: TranslationService,
    ) { }

    public async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
        
        return new Promise(async (resolve, reject) => {
            const res = await this._entityService.existByColumn(
                value,
                validationArguments.constraints ? validationArguments.constraints[0] : validationArguments.property,
                validationArguments.object['id']
            );

            resolve(!res);
        });
    }

    public defaultMessage?(validationArguments?: ValidationArguments): string {
        const {
            property, value
        } = validationArguments;

        const domain = 'validation';

        if (property === 'label') {
            return this._translationService.trans('The label {value} already exist', {
                value: value,
            }, domain).getValue();
        }

        return this._translationService.trans('Value already exist', {
            value: value,
        }, domain).getValue();
    }

}