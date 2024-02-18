import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { TranslationService } from "../../../libs/translation/service/translation.service";
import { ActivityService } from "../service/activity.service";


@ValidatorConstraint({
    name: 'ActivityExistConstraint',
    async: true
})
@Injectable()
export class ActivityExistConstraint implements ValidatorConstraintInterface {

    public constructor(
        private readonly _service: ActivityService,
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

        return this._translationService.trans('One or more selected Activity doesn\'t exist', {
            value: value,
        }, domain).getValue();
    }

}