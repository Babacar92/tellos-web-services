import { MedicalVisitEntity } from "src/entities/psql/MedicalVisitEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface MedicalVisitPaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: MedicalVisitEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}