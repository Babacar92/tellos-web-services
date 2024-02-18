import { AdminDocumentEntity } from "src/entities/psql/AdminDocumentEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface AdminDocumentPaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: AdminDocumentEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}