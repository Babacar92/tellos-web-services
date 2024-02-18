import { EmployeeDocumentEntity } from "src/entities/psql/EmployeeDocumentEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface EmployeeDocumentPaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: EmployeeDocumentEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}