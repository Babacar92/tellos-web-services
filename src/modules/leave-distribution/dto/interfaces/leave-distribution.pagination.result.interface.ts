import { LeaveDistributionEntity } from "src/entities/psql/LeaveDistributionEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface LeaveDistributionPaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: LeaveDistributionEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}