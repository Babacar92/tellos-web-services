import { BusinessTenderTypeEntity } from "src/entities/psql/BusinessTenderTypeEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface BusinessTenderTypePaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: BusinessTenderTypeEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}