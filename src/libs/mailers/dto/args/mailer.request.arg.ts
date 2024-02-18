import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class MailerRequestArg {

    /**
     * Email to send example
     */
    @IsNotEmpty()
    @IsEmail()
    email: string;

    /**
     * The subject of Email
     */
    @IsNotEmpty()
    @IsString()
    subject: string;

    /**
     * The title of Email
     */
    @IsNotEmpty()
    @IsString()
    title: string;

    /**
     * The body of Email
     */
    @IsNotEmpty()
    @IsString()
    body: string;

}