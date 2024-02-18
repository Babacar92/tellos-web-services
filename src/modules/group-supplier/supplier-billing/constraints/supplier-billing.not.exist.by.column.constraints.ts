import { Injectable } from '@nestjs/common';
import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { TranslationService } from '@Libs/translation/service/translation.service';
import { SupplierBillingService } from '../supplier-billing.service';

@ValidatorConstraint({
    name: 'SupplierBillingNotExistByColumnConstraint',
    async: true,
})
@Injectable()
export class SupplierBillingNotExistByColumnConstraint
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
        return new Promise(async (resolve, reject) => {
            const res = await this._service.existByColumn(
                value,
                validationArguments.constraints
                    ? validationArguments.constraints[0]
                    : validationArguments.property,
                validationArguments.object['id'],
            );

            resolve(!res);
        });
    }

    public defaultMessage?(validationArguments?: ValidationArguments): string {
        const { property, value } = validationArguments;

        const domain = 'validation';

        if (property === 'comment') {
            return this._translationService
                .trans(
                    'The comment {value} already exist',
                    {
                        value: value,
                    },
                    domain,
                )
                .getValue();
        }

        return this._translationService
            .trans(
                'Value already exist',
                {
                    value: value,
                },
                domain,
            )
            .getValue();
    }
}
