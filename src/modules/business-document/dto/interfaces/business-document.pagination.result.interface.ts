import { BusinessDocumentEntity } from "src/entities/psql/BusinessDocumentEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface BusinessDocumentPaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: BusinessDocumentEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}