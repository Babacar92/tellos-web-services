import { NotificationTypeEntity } from "src/entities/psql/NotificationTypeEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface NotificationTypePaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: NotificationTypeEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}