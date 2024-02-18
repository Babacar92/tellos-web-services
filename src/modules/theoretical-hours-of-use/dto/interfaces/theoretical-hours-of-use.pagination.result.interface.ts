import { TheoreticalHoursOfUseEntity } from "src/entities/psql/TheoreticalHoursOfUseEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface TheoreticalHoursOfUsePaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: TheoreticalHoursOfUseEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}