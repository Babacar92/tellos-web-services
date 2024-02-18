import { QualificationEntity } from "src/entities/psql/QualificationEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface QualificationPaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: QualificationEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}