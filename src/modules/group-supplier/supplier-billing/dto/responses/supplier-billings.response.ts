import { SupplierBilling } from '@Entities/supplier-billing.entity';
import { ResultPaginationInterface } from '@Libs/databases/dto/interfaces/result.pagination.interface';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SupplierBillingsResponse {
    @Field((type) => [SupplierBilling])
    result: SupplierBilling[];

    @Field((type) => ResultPaginationInterface)
    pagination: ResultPaginationInterface;
}
