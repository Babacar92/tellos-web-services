import { BusinessMarketTypeEntity } from "src/entities/psql/BusinessMarketTypeEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface BusinessMarketTypePaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: BusinessMarketTypeEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}