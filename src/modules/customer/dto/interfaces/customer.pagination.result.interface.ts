import { CustomerEntity } from "src/entities/psql/CustomerEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface CustomerPaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: CustomerEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}