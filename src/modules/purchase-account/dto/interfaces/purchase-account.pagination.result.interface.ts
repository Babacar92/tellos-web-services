import { PurchaseAccountEntity } from "src/entities/psql/PurchaseAccountEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface PurchaseAccountPaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: PurchaseAccountEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}