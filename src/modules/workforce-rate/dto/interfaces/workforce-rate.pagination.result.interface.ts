import { WorkforceRateEntity } from "src/entities/psql/WorkforceRateEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface WorkforceRatePaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: WorkforceRateEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}