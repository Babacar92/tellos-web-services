import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";
import { ContractLevelEntity } from "src/entities/psql/ContractLevelEntity";

export interface ContractLevelPaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: ContractLevelEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}