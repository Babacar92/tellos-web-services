import { Field, ObjectType } from '@nestjs/graphql';
import { Supplier } from '@/entities/psql/supplier.entity';
import { ResultPaginationInterface } from '@Libs/databases/dto/interfaces/result.pagination.interface';

@ObjectType('SuppliersResponse')
export class SuppliersResponse {
    @Field(() => [Supplier])
    result: Supplier[];
    @Field(() => ResultPaginationInterface)
    pagination: ResultPaginationInterface;
}
