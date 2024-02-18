import { RegulationCodeEntity } from "src/entities/psql/RegulationCodeEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface RegulationCodePaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: RegulationCodeEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}