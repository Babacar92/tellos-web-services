import { CustomerContactEntity } from "src/entities/psql/CustomerContactEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface CustomerContactPaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: CustomerContactEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}