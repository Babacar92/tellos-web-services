import { CareerPathEntity } from "src/entities/psql/CareerPathEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface CareerPathPaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: CareerPathEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}