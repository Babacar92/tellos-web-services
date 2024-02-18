import { BusinessBatchEntity } from "src/entities/psql/BusinessBatchEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface BusinessBatchPaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: BusinessBatchEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}