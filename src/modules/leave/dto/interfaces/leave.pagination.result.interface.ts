import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";
import { LeaveEntity } from "src/entities/psql/LeaveEntity";

export interface LeavePaginationResultInterface {

    /**
     * List of Quick Access
     */
    result:LeaveEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}