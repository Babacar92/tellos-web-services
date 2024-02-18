import { registerEnumType } from '@nestjs/graphql';

export enum SupplierCurrencyEnum {
    EUR = 'EUR',
}
registerEnumType(SupplierCurrencyEnum, { name: 'SupplierCurrencyEnum' });
