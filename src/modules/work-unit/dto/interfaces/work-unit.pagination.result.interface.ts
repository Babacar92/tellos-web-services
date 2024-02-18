import { WorkUnitEntity } from "src/entities/psql/WorkUnitEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface WorkUnitPaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: WorkUnitEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}