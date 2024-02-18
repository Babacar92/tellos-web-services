import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";
import { ContractEntity } from "src/entities/psql/ContractEntity";

export interface ContractPaginationResultInterface {

    /**
     * List of Employee Contract
     */
    result: ContractEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}