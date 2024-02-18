import { QuickAccessEntity } from "../../../../entities/psql/QuickAccessEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface QuickAccessPaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: QuickAccessEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}