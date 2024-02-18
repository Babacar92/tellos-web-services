import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";
import { ContractSectionEntity } from "src/entities/psql/ContractSectionEntity";

export interface ContractSectionPaginationResultInterface {

    /**
     * List of Quick Access
     */
    result:  ContractSectionEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}