import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { TranslationService } from "../../../libs/translation/service/translation.service";
import { ArticleFamilyService } from "../services/article-family.service";


@ValidatorConstraint({
    name: 'ArticleFamilyIsChildOfConstraint',
    async: true
})
@Injectable()
export class ArticleFamilyIsChildOfConstraint implements ValidatorConstraintInterface {

    public constructor(
        private readonly _articlefamilyService: ArticleFamilyService,
        private readonly _translationService: TranslationService,
    ) { }

    public async validate(value: any, validationArguments: ValidationArguments): Promise<boolean> {
        return this._articlefamilyService.isChildOf(validationArguments.object['parentFamily'], value);
    }

    public defaultMessage?(validationArguments?: ValidationArguments): string {
        const {
            property, value
        } = validationArguments;

        const domain = 'validation';

        return this._translationService.trans('One or more selected ArticleFamily is not child of the current parent family', {
            value: value,
        }, domain).getValue();
    }

}