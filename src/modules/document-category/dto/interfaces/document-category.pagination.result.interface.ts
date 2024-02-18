import { DocumentCategoryEntity } from "src/entities/psql/DocumentCategoryEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface DocumentCategoryPaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: DocumentCategoryEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}