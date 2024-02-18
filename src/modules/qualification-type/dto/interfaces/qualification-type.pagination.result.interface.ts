import { QualificationTypeEntity } from "src/entities/psql/QualificationTypeEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface QualificationTypePaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: QualificationTypeEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}