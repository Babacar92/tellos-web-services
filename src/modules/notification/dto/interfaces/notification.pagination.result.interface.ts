import { NotificationEntity } from "src/entities/psql/NotificationEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface NotificationPaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: NotificationEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}