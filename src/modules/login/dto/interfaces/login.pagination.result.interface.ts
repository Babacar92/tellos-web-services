import { LoginEntity } from "src/entities/psql/LoginEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface LoginPaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: LoginEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}