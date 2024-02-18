import { EquipmentTechnicalThumbnail } from "src/entities/psql/equipment-technical-thumbnail.entity";
import { ResultPaginationInterface } from "../../../../libs/databases/dto/interfaces/result.pagination.interface";

export interface EquipmentTechnicalThumbnailPaginationResultInterface {

    /**
     * List of equipment technical thumbnail
     */
    result: EquipmentTechnicalThumbnail[];

    /**
     * The pagination of Result
     */
    pagination: ResultPaginationInterface;

}