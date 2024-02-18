import { ResultPaginationInterface } from "../../../databases/dto/interfaces/result.pagination.interface";
import { TranslationTextFrontInterface } from "./controller.interfaces";

/**
 * The Permission pagination interface
 */
export interface TranslationPaginationResultInterface {

    /**
     * Result of request
     */
    result: TranslationTextFrontInterface[];

    /**
     * Pagination of Result
     */
    pagination: ResultPaginationInterface;

}