import { CustomerNoteEntity } from "src/entities/psql/CustomerNoteEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface CustomerNotePaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: CustomerNoteEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}