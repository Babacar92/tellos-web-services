import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { TranslationService } from "../../../libs/translation/service/translation.service";
import { CategoryEquipmentService } from "../service/category-equipment.service";


@ValidatorConstraint({
    name: 'CategoryEquipmentExistExistConstraint',
    async: true
})
@Injectable()
export class CategoryEquipmentExistConstraint implements ValidatorConstraintInterface {

    public constructor(
        private readonly _service: CategoryEquipmentService,
        private readonly _translationService: TranslationService,
    ) { }

    public async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
        console.log("value", value);
        this._service.exist(value).then(res => {

            console.log("EXIST", res);
        })
        return this._service.exist(value);
    }

    public defaultMessage?(validationArguments?: ValidationArguments): string {
        const {
            property, value
        } = validationArguments;

        const domain = 'validation';

        return this._translationService.trans('One or more selected Category Equipment doesn\'t exist', {
            value: value,
        }, domain).getValue();
    }

}