import { JobDescriptionEntity } from "src/entities/psql/JobDescriptionEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface JobDescriptionPaginationResultInterface {

    /**
     * List of Job Description
     */
    result: JobDescriptionEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}