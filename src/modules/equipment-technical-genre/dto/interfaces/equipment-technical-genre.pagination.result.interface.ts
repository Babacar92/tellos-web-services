import { EquipmentTechnicalGenre } from "src/entities/psql/equipment-technical-genre.entity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface EquipmentTechnicalGenrePaginationResultInterface {

    /**
     * List of equipment technical genre
     */
    result: EquipmentTechnicalGenre[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}