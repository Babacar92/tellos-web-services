import { BusinessDocumentClassificationEntity } from "src/entities/psql/BusinessDocumentClassificationEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface BusinessDocumentClassificationPaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: BusinessDocumentClassificationEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}