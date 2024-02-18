import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";
import { ExpensePostEntity } from "src/entities/psql/ExpensePostEntity";

export interface ExpensePostPaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: ExpensePostEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}