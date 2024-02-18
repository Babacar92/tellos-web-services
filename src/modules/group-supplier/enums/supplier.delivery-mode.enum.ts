import { registerEnumType } from '@nestjs/graphql';

export enum SupplierDeliveryModeEnum {
    TAILGATE_REQUIRED = 'TAILGATE_REQUIRED',
    TARPAULIN = 'TARPAULIN',
    PLATEAU = 'PLATEAU',
    DUMP = 'DUMP',
}
registerEnumType(SupplierDeliveryModeEnum, {
    name: 'SupplierDeliveryModeEnum',
});
