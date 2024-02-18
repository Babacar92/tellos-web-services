import { IsInt, IsOptional, IsString, Validate } from "class-validator";
import { DatabaseFilterArg } from "src/libs/databases/dto/args/database.filter.arg";
import { ContractLevelExistConstraint } from "src/modules/contract-level/constraints/contract-level.exist.constraint";
import { ContractApprenticeExistConstraint } from "src/modules/contract-apprentice/constraints/contract-apprentice.exist.constraint";
import { ContractSectionExistConstraint } from "src/modules/contract-section/constraints/contract-section.exist.constraint";
import { ContractTypeEntryExistConstraint } from "src/modules/contract-type-entry/constraints/contract-type-entry.exist.constraint";
import { EmployeeExistConstraint } from "src/modules/employee/constraints/employee.exist.constraint";
import { JobDescriptionExistConstraint } from "src/modules/job-description/constraints/job-description.exist.constraint";

/**
 * Input for to filter a new Employee Contract
 */
export class ContractFilterArgInput extends DatabaseFilterArg {

    /**
     * The target job for filter
     */
    @IsOptional()
    @IsString()
    public job?: string;

    /**
     * The target jobs for filter
     */
    @IsOptional()
    @IsString({
        each: true,
    })
    public jobs?: string[];

    /**
     * The employe id
     */
    @IsOptional()
    @IsInt()
    @Validate(EmployeeExistConstraint, {
  
    })
    public employeeId?: number;
  
    /**
     * The employe id
     */
    @IsOptional()
    @IsInt()
    @Validate(EmployeeExistConstraint, {
          each: true,
    })
    public employeeIds?: number[];

    /**
     * The type entry id
     */
    @IsOptional()
    @IsInt()
    @Validate(ContractTypeEntryExistConstraint, {
  
    })
    public typeEntryId?: number;
  
    /**
     * The type entry id
     */
    @IsOptional()
    @IsInt()
    @Validate(ContractTypeEntryExistConstraint, {
          each: true,
    })
    public typeEntryIds?: number[];

    /**
     * The level id
     */
    @IsOptional()
    @IsInt()
    @Validate(ContractLevelExistConstraint, {
  
    })
    public levelId?: number;
  
    /**
     * The level id
     */
    @IsOptional()
    @IsInt()
    @Validate(ContractLevelExistConstraint, {
          each: true,
    })
    public levelIds?: number[];

    /**
     * The section id
     */
    @IsOptional()
    @IsInt()
    @Validate(ContractSectionExistConstraint, {
  
    })
    public sectionId?: number;
  
    /**
     * The section id
     */
    @IsOptional()
    @IsInt()
    @Validate(ContractSectionExistConstraint, {
          each: true,
    })
    public sectionIds?: number[];

    /**
     * The apprentice id
     */
    @IsOptional()
    @IsInt()
    @Validate(ContractApprenticeExistConstraint, {
  
    })
    public apprenticeId?: number;
  
    /**
     * The apprentices id jobDescription
     */
    @IsOptional()
    @IsInt()
    @Validate(ContractApprenticeExistConstraint, {
          each: true,
    })
    public apprenticeIds?: number[];

    /**
     * jobDescription
     */
    @IsOptional()
    @IsInt()
    @Validate(JobDescriptionExistConstraint, {      
    })
    public jobDescriptionId?: number; 

    /**
     *  jobDescription
     */
    @IsOptional()
    @IsInt()
    @Validate(JobDescriptionExistConstraint, {
            each: true,
    })
    public jobDescriptionIds?: number[];
    
}