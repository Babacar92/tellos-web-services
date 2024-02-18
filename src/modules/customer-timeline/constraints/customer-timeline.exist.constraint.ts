import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { TranslationService } from "../../../libs/translation/service/translation.service";
import { CustomerTimelineService } from "../service/customer-timeline.service";


@ValidatorConstraint({
    name: 'CustomerTimelineExistConstraint',
    async: true
})
@Injectable()
export class CustomerTimelineExistConstraint implements ValidatorConstraintInterface {

    public constructor(
        private readonly _service: CustomerTimelineService,
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

        return this._translationService.trans('One or more selected Contact doesn\'t exist', {
            value: value,
        }, domain).getValue();
    }

}