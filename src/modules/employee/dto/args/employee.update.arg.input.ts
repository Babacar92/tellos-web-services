import {
    IsBoolean,
    IsDate,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Validate,
} from 'class-validator';
import { GraphqlFileUploadValidate } from 'src/libs/upload/decorators/validators/GraphqlFileUploadValidate';
import * as GraphqlFileUpload from 'graphql-upload/Upload.js';
import { EmployeeNotExistByColumnConstraint } from '../../constraints/employee.not.exist.by.column.constraints';
import { EmployeeExistConstraint } from '../../constraints/employee.exist.constraint';
import { Transform } from 'class-transformer';
import { EntityExistConstraint } from 'src/modules/entity/constraints/entity.exist.constraint';
import { EntityEntity } from 'src/entities/psql/EntityEntity';
import { DepartmentExistConstraint } from 'src/modules/department/constraints/department.exist.constraint';
import { DepartmentEntity } from 'src/entities/psql/DepartmentEntity';
import { Employee } from 'src/entities/psql/EmployeeEntity';
import { EmployeeDiplomaEnum } from '../enums/employee.diploma.enum';
import { EmployeeSexEnum } from '../enums/employee.sexe.enum';
import { EmployeeStatusEnum } from '../enums/employee.family.status.enum';
import { EmployeeTitleEnum } from '../enums/employee.title.enum';
import { EmployeeTypeEnum } from '../enums/employee.type.enum';
import { ContractInfoEntity } from '../../../../entities/psql/ContractInfoEntity';
import { ContractInfoExistConstraint } from '../../../contract-info/constraints/contract-info.exist.constraint';
import { LoginExistConstraint } from '../../../login/constraints/login.exist.constraint';
import { LoginEntity } from '../../../../entities/psql/LoginEntity';

/**
 * Input for to update a new Quick Access
 */
export class EmployeeUpdateArgInput {
    /**
     * The id of Quick Access
     */
    @IsNotEmpty()
    @Validate(EmployeeExistConstraint, {})
    public id: number;

    /**
     * The Entity of Employee
     */
    @IsOptional()
    @Validate(EntityExistConstraint, {})
    @Transform(({ value }) => EntityEntity.init(value))
    public entity?: EntityEntity;

    /**
     * The Login of Employee
     */
    @IsOptional()
    @Validate(LoginExistConstraint, {})
    @Transform(({ value }) => LoginEntity.init(value))
    public login?: LoginEntity;

    /**
     * The Entity of Employee
     */
    @IsOptional()
    @Validate(ContractInfoExistConstraint, {})
    @Transform(({ value }) => ContractInfoEntity.init(value))
    public contractInfo?: ContractInfoEntity;

    /**
     * The Company Departure of Employee
     */
    @IsOptional()
    @Validate(EntityExistConstraint, {})
    @Transform(({ value }) => EntityEntity.init(value))
    public companyDeparture?: EntityEntity;

    /**
     * The Entity of Employee
     */
    @IsOptional()
    @Validate(DepartmentExistConstraint, {})
    @Transform(({ value }) => DepartmentEntity.init(value))
    public department?: DepartmentEntity;

    /**
     * The superior of Employee
     */
    @IsOptional()
    @Validate(EmployeeExistConstraint, {})
    @Transform(({ value }) => Employee.init(value))
    public superior?: Employee;

    /**
     * The boss of Employee
     */
    @IsOptional()
    @Validate(EmployeeExistConstraint, {})
    @Transform(({ value }) => Employee.init(value))
    public boss?: Employee;

    /**
     * The picture of Employee
     */
    @IsOptional()
    @GraphqlFileUploadValidate({
        extension: ['jpg', 'png', 'jpeg', 'jfif'],
    })
    public picture?: GraphqlFileUpload;

    /**
     * The Email pro of Employee
     */
    @IsOptional()
    @IsString()
    @Validate(EmployeeNotExistByColumnConstraint, {})
    @Transform(({ value }) => (value ? value : null))
    public emailPro?: string;

    /**
     * The nationality of Employee
     */
    @IsOptional()
    @IsString()
    @Transform(({ value }) => (value ? value : null))
    public nationality?: string;

    /**
     * The title of Employee
     */
    @IsOptional()
    @IsEnum(EmployeeTitleEnum)
    @Transform(({ value }) => (value ? value : null))
    public title?: EmployeeTitleEnum;

    /**
     * The secureNumber of Employee
     */
    @IsOptional()
    @IsString()
    @Validate(EmployeeNotExistByColumnConstraint, {})
    @Transform(({ value }) => (value ? value : null))
    public secureNumber?: string;

    /**
     * The residencePermit of Employee
     */
    @IsOptional()
    @IsString()
    @Validate(EmployeeNotExistByColumnConstraint, {})
    @Transform(({ value }) => (value ? value : null))
    public residencePermit?: string;

    /**
     * The countryBirth of Employee
     */
    @IsOptional()
    @IsString()
    @Transform(({ value }) => (value ? value : null))
    public countryBirth?: string;

    /**
     * Number of children
     */
    @IsOptional()
    @IsInt()
    public numberOfChildren?: number;

    /**
     * rpExpirationDate of children
     */
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public rpExpirationDate?: Date;

    /**
     * The phone pro of Employee
     */
    @IsOptional()
    @IsString()
    @Validate(EmployeeNotExistByColumnConstraint, {})
    @Transform(({ value }) => (value ? value : null))
    public phonePro?: string;

    /**
     * The phone fix pro of Employee
     */
    @IsOptional()
    @IsString()
    @Validate(EmployeeNotExistByColumnConstraint, {})
    @Transform(({ value }) => (value ? value : null))
    public phoneFixPro?: string;

    /**
     * The email perso of Employee
     */
    @IsOptional()
    @IsString()
    @Validate(EmployeeNotExistByColumnConstraint, {})
    @Transform(({ value }) => (value ? value : null))
    public emailPerso?: string;

    /**
     * The phone perso of Employee
     */
    @IsOptional()
    @IsString()
    @Validate(EmployeeNotExistByColumnConstraint, {})
    @Transform(({ value }) => (value ? value : null))
    public phonePerso?: string;

    /**
     * The phone fix perso of Employee
     */
    @IsOptional()
    @IsString()
    @Validate(EmployeeNotExistByColumnConstraint, {})
    @Transform(({ value }) => (value ? value : null))
    public phoneFixPerso?: string;

    /**
     * The phone shortcut of Employee
     */
    @IsOptional()
    @IsString()
    @Validate(EmployeeNotExistByColumnConstraint, {})
    @Transform(({ value }) => (value ? value : null))
    public phoneShortcut?: string;

    /**
     * The internal number of Employee
     */
    @IsOptional()
    @IsString()
    @Validate(EmployeeNotExistByColumnConstraint, {})
    @Transform(({ value }) => (value ? value : null))
    public internalNumber?: string;

    /**
     * The rib of Employee
     */
    @IsOptional()
    @IsString()
    @Validate(EmployeeNotExistByColumnConstraint, {})
    @Transform(({ value }) => (value ? value : null))
    public rib?: string;

    /**
     * The last name of Employee
     */
    @IsOptional()
    @IsString()
    @Transform(({ value }) => (value ? value : null))
    public lastname?: string;

    /**
     * The last name of Employee
     */
    @IsOptional()
    @IsString()
    @Transform(({ value }) => (value ? value : null))
    public lastnameBis?: string;

    /**
     * The first name of Employee
     */
    @IsOptional()
    @IsString()
    @Transform(({ value }) => (value ? value : null))
    public firstname?: string;

    /**
     * The city birth of Employee
     */
    @IsOptional()
    @IsString()
    @Transform(({ value }) => (value ? value : null))
    public cityBirth?: string;

    /**
     * The rpDeliveryBy of Employee
     */
    @IsOptional()
    @IsString()
    @Transform(({ value }) => (value ? value : null))
    public rpDeliveryBy?: string;

    /**
     * The bank of Employee
     */
    @IsOptional()
    @IsString()
    @Transform(({ value }) => (value ? value : null))
    public bank?: string;

    /**
     * The position of Employee
     */
    @IsOptional()
    @IsString()
    @Transform(({ value }) => (value ? value : null))
    public position?: string;

    /**
     * The familyStatus of Employee
     */
    @IsOptional()
    @IsEnum(EmployeeStatusEnum)
    @Transform(({ value }) => (value ? value : null))
    public familyStatus?: EmployeeStatusEnum;

    /**
     * The address of Employee
     */
    @IsOptional()
    @IsString()
    @Transform(({ value }) => (value ? value : null))
    public address?: string;

    /**
     * The postcode of Employee
     */
    @IsOptional()
    @IsString()
    @Transform(({ value }) => (value ? value : null))
    public postcode?: string;

    /**
     * The city of Employee
     */
    @IsOptional()
    @IsString()
    @Transform(({ value }) => (value ? value : null))
    public city?: string;

    /**
     * The diplome of Employee
     */
    @IsOptional()
    @IsEnum(EmployeeDiplomaEnum)
    @Transform(({ value }) => (value ? value : null))
    public diplome?: EmployeeDiplomaEnum;

    /**
     * The diplome of Employee
     */
    @IsOptional()
    @IsEnum(EmployeeSexEnum)
    @Transform(({ value }) => (value ? value : null))
    public gender?: EmployeeSexEnum;

    /**
     * The country of Employee
     */
    @IsOptional()
    @IsString()
    @Transform(({ value }) => (value ? value : null))
    public country?: string;

    /**
     * The handicap of Employee
     */
    @IsOptional()
    @IsBoolean()
    public handicap?: boolean;

    /**
     * The birthday of Employee
     */
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => {
        if (value) {
            value = new Date(value);
            return isNaN(value) ? null : value;
        }
    })
    public birthday?: Date;

    /**
     * The type
     */
    @IsOptional()
    @IsEnum(EmployeeTypeEnum, {})
    public type?: EmployeeTypeEnum;

    /**
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean;
}
