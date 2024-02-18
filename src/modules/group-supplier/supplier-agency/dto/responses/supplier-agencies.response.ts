import { SupplierAgency } from "@Entities/supplier-agency.entity";
import { ResultPaginationInterface } from "../../../../../libs/databases/dto/interfaces/result.pagination.interface";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class SupplierAgenciesResponse {

    @Field((type) => [SupplierAgency])
    result: SupplierAgency[];

    @Field((type) => ResultPaginationInterface)
    pagination: ResultPaginationInterface;

}