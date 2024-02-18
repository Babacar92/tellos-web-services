import { Field, ObjectType } from "@nestjs/graphql";
import { SupplierLanguageCodeEntity } from "@/entities/psql/SupplierLanguageCodeEntity";
import { ResultPaginationInterface } from "@/libs/databases/dto/interfaces/result.pagination.interface";

@ObjectType('SupplierLanguageCodesResponse')
export class SupplierLanguageCodesResponse {
    @Field(() => [SupplierLanguageCodeEntity])
    result: SupplierLanguageCodeEntity[];
    @Field(() => ResultPaginationInterface)
    pagination: ResultPaginationInterface;
}