import { MediumSizedCentreEntity } from "src/entities/psql/MediumSizedCentreEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface MediumSizedCentrePaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: MediumSizedCentreEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}