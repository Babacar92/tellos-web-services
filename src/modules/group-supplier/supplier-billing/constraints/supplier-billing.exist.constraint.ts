import { Injectable } from '@nestjs/common';
import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { TranslationService } from '@Libs/translation/service/translation.service';
import { SupplierBillingService } from '../supplier-billing.service';

@ValidatorConstraint({
    name: 'SupplierBillingExistConstraint',
    async: true,
})
@Injectable()
export class SupplierBillingExistConstraint
    implements ValidatorConstraintInterface
{
    public constructor(
        private readonly _service: SupplierBillingService,
        private readonly _translationService: TranslationService,
    ) {}

    public async validate(
        value: any,
        validationArguments?: ValidationArguments,
    ): Promise<boolean> {
        return this._service.exist(value);
    }

    public defaultMessage?(validationArguments?: ValidationArguments): string {
        const { property, value } = validationArguments;

        const domain = 'validation';

        return this._translationService
            .trans(
                "One or more selected supplier billing doesn't exist",
                {
                    value: value,
                },
                domain,
            )
            .getValue();
    }
}
