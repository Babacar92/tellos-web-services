import { QualificationNameEntity } from "src/entities/psql/QualificationNameEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface QualificationNamePaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: QualificationNameEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}