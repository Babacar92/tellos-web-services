import { GoodEntity } from "src/entities/psql/GoodEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface GoodPaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: GoodEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}