import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { TranslationService } from "../../../libs/translation/service/translation.service";
import { SectionCodeService } from "../service/section-code.service";


@ValidatorConstraint({
    name: 'SectionCodeForArticleFamilyConstraint',
    async: true
})
@Injectable()
export class SectionCodeForArticleFamilyConstraint implements ValidatorConstraintInterface {

    public constructor(
        private readonly _service: SectionCodeService,
        private readonly _translationService: TranslationService,
    ) { }

    public async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
        return this._service.linkToExpensePost(value.id, validationArguments.constraints);
    }

    public defaultMessage?(validationArguments?: ValidationArguments): string {
        const {
            property, value
        } = validationArguments;

        const domain = 'validation';

        return this._translationService.trans('The Section Code is not usable for Article Family, The section code need to be link to expense post Fourniture, Location, Sous-traitance, Group ou Divers ', {
            value: value,
        }, domain).getValue();
    }

}