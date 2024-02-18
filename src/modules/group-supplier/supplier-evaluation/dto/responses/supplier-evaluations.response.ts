import { SupplierEvaluation } from "@Entities/supplier-evaluation.entity";
import { ResultPaginationInterface } from "../../../../../libs/databases/dto/interfaces/result.pagination.interface";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class SupplierEvaluationsResponse {

    @Field((type) => [SupplierEvaluation])
    result: SupplierEvaluation[];

    @Field((type) => ResultPaginationInterface)
    pagination: ResultPaginationInterface;

}