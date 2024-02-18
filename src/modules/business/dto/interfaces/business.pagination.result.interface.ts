import { BusinessEntity } from "src/entities/psql/BusinessEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface BusinessPaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: BusinessEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}