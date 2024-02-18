import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";
import { ContractTypeEntryEntity } from "src/entities/psql/ContractTypeEntryEntity";
export interface ContractTypeEntryPaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: ContractTypeEntryEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}