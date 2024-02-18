import { EmployeeDisciplinaryEntity } from "src/entities/psql/EmployeeDisciplinaryEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface EmployeeDisciplinaryPaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: EmployeeDisciplinaryEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}