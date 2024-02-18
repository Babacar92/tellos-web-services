import { AdministrativeMaterialEntity } from "src/entities/psql/AdministrativeMaterialEntity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface AdministrativeMaterialPaginationResultInterface {

    /**
     * List of Quick Access
     */
    result: AdministrativeMaterialEntity[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}