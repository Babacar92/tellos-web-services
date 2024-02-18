import { InseeCodeEntity } from "src/entities/psql/InseeCodeEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface InseeCodePaginationResultInterface {

    /**
     * List of Comment Contract
     */
    result: InseeCodeEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}