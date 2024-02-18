import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { TranslationService } from "../../../libs/translation/service/translation.service";
import { ParagraphFrameService } from "../services/paragraph-frame.service";


@ValidatorConstraint({
    name: 'ParagraphFrameExistConstraint',
    async: true
})
@Injectable()
export class ParagraphFrameExistConstraint implements ValidatorConstraintInterface {

    public constructor(
        private readonly _paragraphframeService: ParagraphFrameService,
        private readonly _translationService: TranslationService,
    ) { }

    public async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
        return this._paragraphframeService.exist(value);
    }

    public defaultMessage?(validationArguments?: ValidationArguments): string {
        const {
            property, value
        } = validationArguments;

        const domain = 'validation';

        return this._translationService.trans('One or more selected ParagraphFrame doesn\'t exist', {
            value: value,
        }, domain).getValue();
    }

}