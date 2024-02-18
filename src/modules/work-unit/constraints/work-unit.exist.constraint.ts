import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { TranslationService } from "../../../libs/translation/service/translation.service";
import { WorkUnitService } from "../service/work-unit.service";


@ValidatorConstraint({
    name: 'WorkUnitExistConstraint',
    async: true
})
@Injectable()
export class WorkUnitExistConstraint implements ValidatorConstraintInterface {

    public constructor(
        private readonly _service: WorkUnitService,
        private readonly _translationService: TranslationService,
    ) { }

    public async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
        return value? this._service.exist(value) : true;
    }

    public defaultMessage?(validationArguments?: ValidationArguments): string {
        const {
            property, value
        } = validationArguments;

        const domain = 'validation';

        return this._translationService.trans('One or more selected Work Unit doesn\'t exist', {
            value: value,
        }, domain).getValue();
    }

}