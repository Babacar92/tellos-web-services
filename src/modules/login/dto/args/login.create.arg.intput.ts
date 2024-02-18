import {
    IsBoolean,
    IsEmail,
    IsOptional,
    IsString,
    Validate,
} from 'class-validator';
import { PasswordValidate } from '../../../../libs/databases/decorators/validators/PasswordValidate';
import { EmployeeExistConstraint } from 'src/modules/employee/constraints/employee.exist.constraint';
import { Transform } from 'class-transformer';
import { Employee } from 'src/entities/psql/EmployeeEntity';
import { LoginNotExistByColumnConstraint } from '../../constraints/login.not.exist.by.column.constraints';

export class LoginCreateArgInput {
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
     * Is active
     */
    @IsOptional()
    @IsBoolean()
    public active = true;
}
