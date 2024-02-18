import { BusinessDocumentTypeEntity } from "src/entities/psql/BusinessDocumentTypeEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface BusinessDocumentTypePaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: BusinessDocumentTypeEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}