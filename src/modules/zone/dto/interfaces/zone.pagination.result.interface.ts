import { ZoneEntity } from "src/entities/psql/ZoneEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface ZonePaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: ZoneEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}