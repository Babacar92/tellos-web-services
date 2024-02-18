import { LoginPermissionEntity } from "src/entities/psql/LoginPermissionEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface LoginPermissionPaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: LoginPermissionEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}