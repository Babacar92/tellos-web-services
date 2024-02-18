import { Transform } from 'class-transformer';
import {
    IsBoolean,
    IsDate,
    IsEmail,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Validate,
} from 'class-validator';
import { PasswordValidate } from '../../../../libs/databases/decorators/validators/PasswordValidate';
import { LoginExistConstraint } from '../../constraints/login.exist.constraint';
import { LoginNotExistByColumnConstraint } from '../../constraints/login.not.exist.by.column.constraints';
import { EmployeeExistConstraint } from '../../../employee/constraints/employee.exist.constraint';
import { Employee } from '../../../../entities/psql/EmployeeEntity';

export class LoginUpdateArgInput {
    /**
     * Id of Login User
     */
    @IsNotEmpty()
    @IsInt()
    @Validate(LoginExistConstraint, {})
    public id: number;
    /**
     * Employee of login
     */
    @IsOptional()
    @Validate(EmployeeExistConstraint, {})
    @Transform(({ value }) => Employee.init(value))
    public employee?: Employee;

    /**
     * Firstname of Login User
     */
    @IsOptional()
    @IsString()
    public firstname?: string;

    /**
     * Lastname of Login User
     */
    @IsOptional()
    @IsString()
    public lastname?: string;

    /**
     * Is external
     */
    @IsOptional()
    @IsBoolean()
    public isExternal?: boolean;

    /**
     * Email of Login User
     */
    @IsOptional()
    @IsEmail()
    @Validate(LoginNotExistByColumnConstraint, {})
    public email?: string;

    /**
     * Email of Login User
     */
    @IsOptional()
    @IsString()
    @Validate(LoginNotExistByColumnConstraint, {})
    public username?: string;

    /**
     * Password of Login User
     */
    @IsOptional()
    @PasswordValidate({
        minChar: 6,
        lowerCase: true,
        numberChar: true,
        specChar: true,
        upperCase: true,
    })
    public password?: string;

    /**
     * Confirmation of Login User
     */
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    public confirmedAt?: Date;

    /**
     * Last login of Login User
     */
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    public lastLogin?: Date;

    /**
     * Toggle active Login User
     */
    @IsOptional()
    @IsBoolean()
    public active?: boolean;
}
