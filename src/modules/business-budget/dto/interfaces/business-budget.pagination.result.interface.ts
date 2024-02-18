import { BusinessBudgetEntity } from "src/entities/psql/BusinessBudgetEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface BusinessBudgetPaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: BusinessBudgetEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}