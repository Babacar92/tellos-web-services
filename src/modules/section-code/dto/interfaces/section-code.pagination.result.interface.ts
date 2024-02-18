import { SectionCodeEntity } from "src/entities/psql/SectionCodeEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface SectionCodePaginationResultInterface {

    /**
     * List of Comment Contract
     */
    result: SectionCodeEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}