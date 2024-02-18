import { EntityEntity } from "src/entities/psql/EntityEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface EntityPaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: EntityEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}