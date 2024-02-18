import { Transform } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

/**
 * The User Login Arg
 */
export class UserLoginArg {

    /**
     * Username of User
     */
    @IsNotEmpty()
    @IsString()
    public username: string;

    /**
     * Password of User
     */
    @IsNotEmpty()
    @IsString()
    public password: string;

    /**
     * Remember me boolean
     */
    @IsOptional()
    @IsBoolean()
    @Transform(({ value }) => !!value)
    public rememberMe?: boolean;

}