import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { TranslationService } from "../../../libs/translation/service/translation.service";


@ValidatorConstraint({
    name: 'EquipmentCheckOrderAndDeliveryDateConstraint',
    async: true
})
@Injectable()
export class EquipmentCheckOrderAndDeliveryDateConstraint implements ValidatorConstraintInterface {

    public constructor(
        private readonly _translationService: TranslationService,
    ) { }

    public async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
        const orderDate = validationArguments.object['orderDate'];
        if (value && orderDate) {
            return orderDate <= value;
        }
        return true;
    }

    public defaultMessage?(validationArguments?: ValidationArguments): string {
        const {
            property, value
        } = validationArguments;

        const domain = 'validation';

        return this._translationService.trans('The delivery date must be greater or equals the order date', {
            value: value,
        }, domain).getValue();
    }

}