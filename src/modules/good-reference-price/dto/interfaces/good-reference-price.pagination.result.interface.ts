import { GoodReferencePriceEntity } from "src/entities/psql/GoodReferencePriceEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface GoodReferencePricePaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: GoodReferencePriceEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}