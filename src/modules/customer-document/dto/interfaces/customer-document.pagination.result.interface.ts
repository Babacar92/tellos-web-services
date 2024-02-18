import { CustomerDocumentEntity } from "src/entities/psql/CustomerDocumentEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface CustomerDocumentPaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: CustomerDocumentEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}