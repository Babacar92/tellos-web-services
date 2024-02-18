import { ActivityEntity } from "src/entities/psql/ActivityEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface ActivityPaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: ActivityEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}