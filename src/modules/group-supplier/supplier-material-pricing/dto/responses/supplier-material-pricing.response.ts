//Nestjs
import { Field, ObjectType } from '@nestjs/graphql';
//Entity
import { SupplierMaterialPricingEntity } from '@/entities/psql/SupplierMaterialPricingEntity';
//Pagination Interface
import { ResultPaginationInterface } from '@Libs/databases/dto/interfaces/result.pagination.interface';

@ObjectType('SupplierMaterialPricingResponse')
export class SupplierMaterialPricingResponse {
    @Field(() => [SupplierMaterialPricingEntity])
    result: SupplierMaterialPricingEntity[];
    @Field(() => ResultPaginationInterface)
    pagination: ResultPaginationInterface;
}
