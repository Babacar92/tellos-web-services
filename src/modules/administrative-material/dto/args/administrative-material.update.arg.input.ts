import { IsBoolean, IsDate, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Validate } from "class-validator";
import { AdministrativeMaterialExistConstraint } from "../../constraints/administrative-material.exist.constraint";
import { LeaveExistConstraint } from "src/modules/leave/constraints/leave.exist.constraint";
import { Transform } from "class-transformer";
import { LeaveEntity } from "src/entities/psql/LeaveEntity";
import { EntityEntity } from "src/entities/psql/EntityEntity";
import { TypeOfSaleEnum } from "../enums/administrative-material-type-of-sale.enum";
import { ExitTypeEnum } from "../enums/administrative-material-exit-type.enum";
import { FinancingEnum } from "../enums/administrative-material-financing.enum";
import { TheoreticalHoursOfUseEntity } from "src/entities/psql/TheoreticalHoursOfUseEntity";

/**
 * Input for to update a new Quick Access
 */
export class AdministrativeMaterialUpdateArgInput {

    /**
     * The id of Quick Access
     */
    @IsNotEmpty()
    @Validate(AdministrativeMaterialExistConstraint, {

    })
    public id: number;

    /**
     * Monthly rent of admin material
     */
    @IsNumber()
    public monthlyRent?: number;

    /**
     * maintenance Rent of administrative material
     */
    @IsNumber()
    public maintenanceRent?: number;

    /**
     * maxAuthorizedKm of administrative material
     */
    @IsNumber()
    public maxAuthorizedKm?: number;

    /**
     * Buy-back Value of administrative material
     */
    @IsNumber()
    public BuybackValue?: number;

    /**
     * fixed Asset Code of administrative material
     */
    @IsNumber()
    public fixedAssetCode?: number;


    /**
     * sale Price of administrative material
     */
    @IsNumber()
    public salePrice?: number;

    /**
     * geolocatization Box Number of administrative material
     */
    @IsNumber()
    public geolocatizationBoxNumber?: number;

    /**
     * monthly Unit Price of administrative material
     */
    @IsNumber()
    public monthlyUnitPrice?: number;

    /**
     * TSVR Purchase of administrative material
     */
    @IsNumber()
    public TSVRPurchase?: number;

    /**
     * TSVR Transfer of administrative material
     */
    @IsNumber()
    public TSVRTransfer?: number;

    /**
     * total Card of administrative material
     */
    @IsNumber()
    public totalCard?: number;

    /**
     * PASSango of administrative material
     */
    @IsNumber()
    public PASSango?: number;

    /**
     * brea-keven Point of administrative material
     */
    @IsNumber()
    public breakevenPoint?: number;

    /**
     * utilization Rate of administrative material
     */
    @IsNumber()
    public utilizationRate?: number;

    /**
   * Comment of admin material
   */
    @IsOptional()
    @IsString()
    public comment?: string;

    /**
    * Financing of admin material
    */
    @IsOptional()
    @IsEnum(FinancingEnum, {

    })
    public financing?: FinancingEnum;

    /**
    * Financing of admin material
    */
    @IsOptional()
    @IsEnum(ExitTypeEnum, {

    })
    public exitType?: ExitTypeEnum;

    /**
    * typeOfSale of admin material
    */
    @IsOptional()
    @IsEnum(TypeOfSaleEnum, {

    })
    public typeOfSale?: TypeOfSaleEnum;

    /**
    * Is pending
    */
    @IsOptional()
    @IsBoolean()
    public pendingExit: boolean;

    /**
    * Is car fleet insurance
    */
    @IsOptional()
    @IsBoolean()
    public carFleetInsurance: boolean;


    /**
    * Is mahinery insurance
    */
    @IsOptional()
    @IsBoolean()
    public machineryInsurance: boolean;

    /**
    * contract Start Date
    */
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public contractStartDate?: Date;

    /**
    * contract End Date
    */
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public contractEndDate?: Date;

    /** 
    * sale Date
    */
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public saleDate?: Date;

    /**
    * company owner of admin material
    */
    @IsOptional()
    @Transform(({ value }) => EntityEntity.init(value))
    public companyOwner?: EntityEntity;

    /**
    * theoretical Hours of use of admin material
    */
    @IsOptional()
    @Transform(({ value }) => TheoreticalHoursOfUseEntity.init(value))
    public theoreticalHour?: TheoreticalHoursOfUseEntity;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean;

}