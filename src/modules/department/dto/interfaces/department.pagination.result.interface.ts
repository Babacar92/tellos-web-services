import { DepartmentEntity } from "../../../../entities/psql/DepartmentEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface DepartmentPaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: DepartmentEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}