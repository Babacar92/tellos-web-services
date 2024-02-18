import { ContractCommentEntity } from "src/entities/psql/ContractCommentEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface ContractCommentPaginationResultInterface {

    /**
     * List of Comment Contract
     */
    result: ContractCommentEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}