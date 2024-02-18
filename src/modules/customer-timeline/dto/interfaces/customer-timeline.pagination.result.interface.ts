import { CustomerTimelineEntity } from "src/entities/psql/CustomerTimelineEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface CustomerTimelinePaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: CustomerTimelineEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}