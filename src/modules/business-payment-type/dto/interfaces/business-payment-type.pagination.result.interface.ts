import { BusinessPaymentTypeEntity } from "src/entities/psql/BusinessPaymentTypeEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface BusinessPaymentTypePaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: BusinessPaymentTypeEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}