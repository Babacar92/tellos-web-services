import { BusinessBatchStatusEntity } from "src/entities/psql/BusinessBatchStatusEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface BusinessBatchStatusPaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: BusinessBatchStatusEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}