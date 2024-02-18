import { BusinessPaymentModeEntity } from "src/entities/psql/BusinessPaymentModeEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface BusinessPaymentModePaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: BusinessPaymentModeEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}