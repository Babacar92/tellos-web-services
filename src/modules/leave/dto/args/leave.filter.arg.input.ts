import { IsBoolean, IsDate, IsEnum, IsInt, IsOptional, IsString } from "class-validator";
import { DatabaseFilterArg } from "src/libs/databases/dto/args/database.filter.arg";
import { LEAVE_ICON } from "../enums/leave.decision.enum";
import { EmployeeSexEnum } from "src/modules/employee/dto/enums/employee.sexe.enum";
import { ContractEnum } from "src/modules/employee/dto/enums/employee.contract.enum";

export class LeaveFilterArgInput extends DatabaseFilterArg {

    /**
     * The employe id decisionMaker
     */
    @IsOptional()
    @IsInt()
    public employeeId?: number;

    /**
     * The employees id
     */
    @IsOptional()
    @IsInt()
    public employeeIds?: number[];

    /**
     * The decisionMaker id 
     */
    @IsOptional()
    @IsInt()
    public decisionMakerId?: number;

    /**
     * The decisionMakers id
     */
    @IsOptional()
    @IsInt()
    public decisionMakerIds?: number[];

    /**
     * The leavePeriodId id
     */
    @IsOptional()
    @IsInt()
    public leavePeriodId?: number;

    /**
     * The leavePeriodIds id
     */
    @IsOptional()
    @IsInt()
    public leavePeriodIds?: number[];

    /**
     * The entity id
     */
    @IsOptional()
    @IsInt()
    public entityId?: number;

    /**
     * The entitys id
     */
    @IsOptional()
    @IsInt()
    public entityIds?: number[];

    /**
     * The entity id
     */
    @IsOptional()
    @IsInt()
    public serviceId?: number;

    /**
     * The entitys id
     */
    @IsOptional()
    @IsInt()
    public serviceIds?: number[];

    /**
     * The target decision for filter 
     */
    @IsOptional()
    @IsEnum(LEAVE_ICON, {

    })
    public decision?: LEAVE_ICON;

    /**
     * The target decisions for filter 
     */
    @IsOptional()
    @IsEnum(LEAVE_ICON, {
        each: true,
    })
    public decisions?: LEAVE_ICON[];

    /**
     * The target gender for filter 
     */
    @IsOptional()
    @IsEnum(EmployeeSexEnum, {

    })
    public gender?: EmployeeSexEnum;

    /**
     * The target genders for filter 
     */
    @IsOptional()
    @IsEnum(EmployeeSexEnum, {
        each: true,
    })
    public genders?: EmployeeSexEnum[];

    /**
     * The target contract for filter 
    */
    @IsOptional()
    @IsEnum(ContractEnum, {

    })
    public contract?: ContractEnum;

    /**
     * The target contracts for filter 
     */
    @IsOptional()
    @IsEnum(ContractEnum, {
        each: true,
    })
    public contracts?: ContractEnum[];

    /**
     * The target hasNotDecisionMaker for filter
     */
    @IsOptional()
    @IsBoolean()
    public hasNotDecisionMaker?: boolean;

}