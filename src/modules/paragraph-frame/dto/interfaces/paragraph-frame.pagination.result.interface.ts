import { ParagraphFrameEntity } from "src/entities/psql/ParagraphFrameEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface ParagraphFramePaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: ParagraphFrameEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}