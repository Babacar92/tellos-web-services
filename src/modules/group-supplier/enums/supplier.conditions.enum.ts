import { registerEnumType } from '@nestjs/graphql';

export enum SupplierConditionEnum {
    FREE_DELIVERY = 'FREE_DELIVERY',
    EXTRA = 'EXTRA',
    PICKUP = 'PICKUP',
    CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
}
registerEnumType(SupplierConditionEnum, { name: 'SupplierConditionEnum' });
