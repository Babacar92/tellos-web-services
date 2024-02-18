import { Field, ObjectType } from '@nestjs/graphql';
import { SupplierContact } from '@/entities/psql/supplier-contact.entity';
import { ResultPaginationInterface } from '@Libs/databases/dto/interfaces/result.pagination.interface';

@ObjectType('SupplierContactsResponse')
export class SupplierContactsResponse {
    @Field(() => [SupplierContact])
    result: SupplierContact[];
    @Field(() => ResultPaginationInterface)
    pagination: ResultPaginationInterface;
}
