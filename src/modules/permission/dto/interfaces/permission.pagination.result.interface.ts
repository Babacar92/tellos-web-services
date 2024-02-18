import { PermissionEntity } from "src/entities/psql/PermissionEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface PermissionPaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: PermissionEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}