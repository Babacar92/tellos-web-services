import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";
import { ContractInfoEntity } from "src/entities/psql/ContractInfoEntity";

export interface ContractPaginationResultInterface {

    /**
     * List of Employee Contract
     */
    result: ContractInfoEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}