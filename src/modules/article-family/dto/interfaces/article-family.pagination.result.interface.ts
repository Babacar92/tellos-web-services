import { ArticleFamilyEntity } from "../../../../entities/psql/ArticleFamilyEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface ArticleFamilyPaginationResultInterface {

    /**
     * List of Article Family
     */
    result: ArticleFamilyEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}