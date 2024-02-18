import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";
import { ContractApprenticeEntity } from "src/entities/psql/ContractApprenticeEntity";

export interface ContractApprenticePaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: ContractApprenticeEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}