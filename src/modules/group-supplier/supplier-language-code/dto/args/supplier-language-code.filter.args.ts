import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { DatabaseFilterArg } from 'src/libs/databases/dto/args/database.filter.arg';
import { InputType } from '@nestjs/graphql';

@InputType()
export class SupplierLanguageCodeFilterArgs extends DatabaseFilterArg {
    @IsOptional()
    @IsString()
    public name?: string;

    @IsOptional()
    @IsString()
    public code?: string;

    @IsOptional()
    @IsBoolean()
    public active?: boolean;
}
