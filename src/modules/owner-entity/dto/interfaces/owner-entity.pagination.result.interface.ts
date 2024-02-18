import { OwnerEntity } from "src/entities/psql/owner-entity.entity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface OwnerEntityPaginationResultInterface {

    /**
     * List of owner entity
     */
    result: OwnerEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}