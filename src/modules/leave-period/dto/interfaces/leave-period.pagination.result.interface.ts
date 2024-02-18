import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";
import { LeavePeriodEntity } from "src/entities/psql/LeavePeriodEntity";

export interface LeavePeriodPaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: LeavePeriodEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}