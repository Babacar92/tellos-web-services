import { DocumentTypeEntity } from "src/entities/psql/DocumentTypeEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface DocumentTypePaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: DocumentTypeEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}