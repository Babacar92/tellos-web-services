import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { TranslationService } from "../../../libs/translation/service/translation.service";
import { DepartmentService } from "../services/department.service";


@ValidatorConstraint({
    name: 'DepartmentExistConstraint',
    async: true
})
@Injectable()
export class DepartmentExistConstraint implements ValidatorConstraintInterface {

    public constructor(
        private readonly _departmentService: DepartmentService,
        private readonly _translationService: TranslationService,
    ) { }

    public async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
        return this._departmentService.exist(value);
    }

    public defaultMessage?(validationArguments?: ValidationArguments): string {
        const {
            property, value
        } = validationArguments;

        const domain = 'validation';

        return this._translationService.trans('One or more selected Department doesn\'t exist', {
            value: value,
        }, domain).getValue();
    }

}