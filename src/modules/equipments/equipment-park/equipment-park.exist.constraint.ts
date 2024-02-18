// NestJs
import { Injectable } from '@nestjs/common';

//Class Validator / Transform
import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

//Services
import { TranslationService } from 'src/libs/translation/service/translation.service';
import { EquipmentParkService } from './equipment-park.service';

@ValidatorConstraint({
    name: 'EquipmentParkExistConstraint',
    async: true,
})
@Injectable()
export class EquipmentParkExistConstraint
    implements ValidatorConstraintInterface
{
    public constructor(
        private readonly equipmentParkService: EquipmentParkService,
        private readonly translationService: TranslationService,
    ) {}

    public async validate(
        value: any,
        validationArguments?: ValidationArguments,
    ): Promise<boolean> {
        return this.equipmentParkService.exist(value);
    }

    public defaultMessage?(validationArguments?: ValidationArguments): string {
        const { property, value } = validationArguments;

        const domain = 'validation';

        return this.translationService
            .trans(
                "One or more selected Entity doesn't exist",
                {
                    value: value,
                },
                domain,
            )
            .getValue();
    }
}
